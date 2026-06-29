import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

export interface BookingConfirmationProps {
  type?: string
  name?: string
  email?: string
  phone?: string
  goals?: string
  preferredTime?: string
  notes?: string
  submittedAt?: string
  calendarUrl?: string
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const heading = { fontSize: '22px', fontWeight: 600, color: '#111111', margin: '0 0 8px' }
const eyebrow = {
  fontSize: '12px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: '#666666',
  margin: '0 0 4px',
}
const label = { fontSize: '12px', color: '#666666', margin: '12px 0 2px' }
const value = { fontSize: '14px', color: '#111111', margin: '0', whiteSpace: 'pre-wrap' as const }
const hr = { borderColor: '#e5e5e5', margin: '20px 0' }
const button = {
  backgroundColor: '#111111',
  color: '#ffffff',
  padding: '12px 20px',
  textDecoration: 'none',
  fontSize: '13px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  display: 'inline-block',
}

const BookingConfirmationEmail = ({
  type = 'session',
  name = 'A new athlete',
  email,
  phone,
  goals,
  preferredTime,
  notes,
  submittedAt,
  calendarUrl,
}: BookingConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New ${type} booking from ${name}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>OOO • New booking</Text>
        <Heading style={heading}>{`${name} requested a ${type} session.`}</Heading>
        <Text style={{ fontSize: '14px', color: '#444444', margin: '4px 0 0' }}>
          Submitted {submittedAt ?? new Date().toUTCString()}
        </Text>

        <Hr style={hr} />

        <Section>
          <Text style={label}>Name</Text>
          <Text style={value}>{name}</Text>

          {email ? (
            <>
              <Text style={label}>Email</Text>
              <Text style={value}>
                <Link href={`mailto:${email}`} style={{ color: '#111111' }}>
                  {email}
                </Link>
              </Text>
            </>
          ) : null}

          {phone ? (
            <>
              <Text style={label}>Phone</Text>
              <Text style={value}>{phone}</Text>
            </>
          ) : null}

          {preferredTime ? (
            <>
              <Text style={label}>Preferred time</Text>
              <Text style={value}>{preferredTime}</Text>
            </>
          ) : null}

          {goals ? (
            <>
              <Text style={label}>Goals</Text>
              <Text style={value}>{goals}</Text>
            </>
          ) : null}

          {notes ? (
            <>
              <Text style={label}>Notes</Text>
              <Text style={value}>{notes}</Text>
            </>
          ) : null}
        </Section>

        {calendarUrl ? (
          <>
            <Hr style={hr} />
            <Section style={{ textAlign: 'center' }}>
              <Button href={calendarUrl} style={button}>
                Add to Google Calendar
              </Button>
              <Text style={{ fontSize: '12px', color: '#666666', margin: '12px 0 0' }}>
                Opens a pre-filled Google Calendar event you can edit before saving.
              </Text>
            </Section>
          </>
        ) : null}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BookingConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `New ${data?.type ?? 'session'} booking — ${data?.name ?? 'OOO website'}`,
  displayName: 'Booking confirmation (internal)',
  previewData: {
    type: 'training',
    name: 'Jordan Sample',
    email: 'jordan@example.com',
    phone: '+1 555 123 4567',
    preferredTime: 'Weekday mornings, EST',
    goals: 'Build conditioning and improve shot mechanics.',
    notes: 'Available starting next week.',
    submittedAt: new Date().toUTCString(),
    calendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Training%20%E2%80%94%20Jordan%20Sample',
  },
} satisfies TemplateEntry