import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

export interface InternalNotificationProps {
  heading?: string
  submittedAt?: string
  lines?: Array<{ label: string; value: string }>
  body?: string
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

const InternalNotificationEmail = ({
  heading: title = 'New website submission',
  submittedAt,
  lines = [],
  body,
}: InternalNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>OOO • Notification</Text>
        <Heading style={heading}>{title}</Heading>
        <Text style={{ fontSize: '14px', color: '#444444', margin: '4px 0 0' }}>
          {submittedAt ?? new Date().toUTCString()}
        </Text>
        <Section>
          {lines.map((l, i) => (
            <React.Fragment key={i}>
              <Text style={label}>{l.label}</Text>
              <Text style={value}>{l.value}</Text>
            </React.Fragment>
          ))}
          {body ? <Text style={{ ...value, marginTop: '16px' }}>{body}</Text> : null}
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InternalNotificationEmail,
  subject: (data: Record<string, any>) =>
    (data?.subject as string) || (data?.heading as string) || 'OOO — New submission',
  displayName: 'Internal notification',
  previewData: {
    subject: 'New inquiry — Jane Doe',
    heading: 'New inquiry from Jane Doe',
    submittedAt: new Date().toUTCString(),
    lines: [
      { label: 'Name', value: 'Jane Doe' },
      { label: 'Email', value: 'jane@example.com' },
      { label: 'Reason', value: 'general' },
    ],
    body: 'Hi Ben, love your work — would like to chat about a partnership.',
  },
} satisfies TemplateEntry