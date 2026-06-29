import * as React from 'react'
import { render } from 'react-email'
import { createClient } from '@supabase/supabase-js'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'ofourown'
const SENDER_DOMAIN = 'notify.oooelitebasketballtraining.com'
const FROM_DOMAIN = 'notify.oooelitebasketballtraining.com'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Server-only helper that renders a registered template and enqueues it for
 * delivery. Intended for unauthenticated server-function flows (public forms)
 * that cannot call /lovable/email/transactional/send (which requires a user JWT).
 */
export async function sendInternalTransactionalEmail(opts: {
  templateName: string
  recipientEmail: string
  templateData?: Record<string, any>
  idempotencyKey?: string
}): Promise<{ ok: boolean; reason?: string }> {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[sendInternalTransactionalEmail] missing supabase env')
    return { ok: false, reason: 'config' }
  }

  const template = TEMPLATES[opts.templateName]
  if (!template) {
    console.error('[sendInternalTransactionalEmail] template not found', opts.templateName)
    return { ok: false, reason: 'template_not_found' }
  }

  const recipient = (template.to || opts.recipientEmail || '').trim()
  if (!recipient) return { ok: false, reason: 'no_recipient' }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const messageId = crypto.randomUUID()
  const idempotencyKey = opts.idempotencyKey || messageId
  const normalizedEmail = recipient.toLowerCase()
  const data = opts.templateData ?? {}

  // Suppression check
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle()
  if (suppressed) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: opts.templateName,
      recipient_email: recipient,
      status: 'suppressed',
    })
    return { ok: false, reason: 'suppressed' }
  }

  // Unsubscribe token (reuse or create)
  let unsubscribeToken: string
  const { data: existing } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalizedEmail)
    .maybeSingle()
  if (existing && !existing.used_at) {
    unsubscribeToken = existing.token
  } else {
    unsubscribeToken = generateToken()
    await supabase
      .from('email_unsubscribe_tokens')
      .upsert(
        { token: unsubscribeToken, email: normalizedEmail },
        { onConflict: 'email', ignoreDuplicates: true },
      )
    const { data: stored } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', normalizedEmail)
      .maybeSingle()
    if (stored?.token) unsubscribeToken = stored.token
  }

  const element = React.createElement(template.component, data)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject =
    typeof template.subject === 'function' ? template.subject(data) : template.subject

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: opts.templateName,
    recipient_email: recipient,
    status: 'pending',
  })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: opts.templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    console.error('[sendInternalTransactionalEmail] enqueue failed', enqueueError)
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: opts.templateName,
      recipient_email: recipient,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    return { ok: false, reason: 'enqueue_failed' }
  }

  return { ok: true }
}

/** Build a Google Calendar "add event" URL pre-filled with booking details. */
export function buildGoogleCalendarUrl(opts: {
  title: string
  details?: string
  startISO?: string
  durationMinutes?: number
}): string {
  const base = 'https://calendar.google.com/calendar/render'
  const params = new URLSearchParams({ action: 'TEMPLATE', text: opts.title })
  if (opts.details) params.set('details', opts.details)
  if (opts.startISO) {
    const start = new Date(opts.startISO)
    if (!Number.isNaN(start.getTime())) {
      const end = new Date(start.getTime() + (opts.durationMinutes ?? 60) * 60_000)
      const fmt = (d: Date) =>
        d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
      params.set('dates', `${fmt(start)}/${fmt(end)}`)
    }
  }
  return `${base}?${params.toString()}`
}