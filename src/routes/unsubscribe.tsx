import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

type State =
  | { kind: 'loading' }
  | { kind: 'valid' }
  | { kind: 'already' }
  | { kind: 'invalid'; message: string }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string }

export const Route = createFileRoute('/unsubscribe')({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === 'string' ? s.token : '',
  }),
  component: UnsubscribePage,
  head: () => ({
    meta: [
      { title: 'Unsubscribe — OOO Performance' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
})

function UnsubscribePage() {
  const { token } = useSearch({ from: '/unsubscribe' })
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false
    if (!token) {
      setState({ kind: 'invalid', message: 'Missing token.' })
      return
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const body = await res.json().catch(() => ({}))
        if (cancelled) return
        if (res.ok && body.valid) setState({ kind: 'valid' })
        else if (res.ok && body.reason === 'already_unsubscribed')
          setState({ kind: 'already' })
        else
          setState({
            kind: 'invalid',
            message: body.error || 'This link is invalid or has expired.',
          })
      })
      .catch(() =>
        setState({ kind: 'invalid', message: 'Could not validate this link.' }),
      )
    return () => {
      cancelled = true
    }
  }, [token])

  async function confirm() {
    setState({ kind: 'submitting' })
    try {
      const res = await fetch('/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok && body.success) setState({ kind: 'success' })
      else if (body.reason === 'already_unsubscribed') setState({ kind: 'already' })
      else
        setState({
          kind: 'error',
          message: body.error || 'Something went wrong. Please try again.',
        })
    } catch {
      setState({ kind: 'error', message: 'Network error. Please try again.' })
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        OOO Performance
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
        Email preferences
      </h1>

      <div className="mt-8 border border-foreground p-6">
        {state.kind === 'loading' && <p>Checking your link…</p>}

        {state.kind === 'valid' && (
          <>
            <p className="text-sm text-muted-foreground">
              Confirm you'd like to unsubscribe from OOO Performance emails. You can
              always re-subscribe later from the site.
            </p>
            <button
              onClick={confirm}
              className="mt-6 h-11 w-full bg-foreground px-6 text-sm uppercase tracking-wider text-background hover:opacity-90"
            >
              Confirm unsubscribe
            </button>
          </>
        )}

        {state.kind === 'submitting' && <p>Updating your preferences…</p>}

        {state.kind === 'success' && (
          <p className="text-sm">
            You're unsubscribed. You will no longer receive emails at this address.
          </p>
        )}

        {state.kind === 'already' && (
          <p className="text-sm">This address is already unsubscribed.</p>
        )}

        {state.kind === 'invalid' && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}

        {state.kind === 'error' && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
      </div>
    </div>
  )
}