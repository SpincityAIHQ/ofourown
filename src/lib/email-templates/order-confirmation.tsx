import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

export interface OrderConfirmationProps {
  customerName?: string
  productName?: string
  amountFormatted?: string
  orderId?: string
  isService?: boolean
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
const value = { fontSize: '14px', color: '#111111', margin: '0' }
const hr = { borderColor: '#e5e5e5', margin: '20px 0' }
const body = { fontSize: '14px', color: '#444444', lineHeight: '1.6', margin: '0 0 12px' }

const OrderConfirmationEmail = ({
  customerName = 'Athlete',
  productName = 'your order',
  amountFormatted,
  orderId,
  isService = false,
}: OrderConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`Thanks for your OfOurOwn order — ${productName}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>OfOurOwn • Order confirmed</Text>
        <Heading style={heading}>Thank you, {customerName}.</Heading>
        <Text style={body}>
          We received your order for <strong>{productName}</strong>
          {amountFormatted ? <> — {amountFormatted}</> : null}. A separate receipt from our
          payment processor will land in your inbox shortly.
        </Text>

        <Hr style={hr} />

        {isService ? (
          <Section>
            <Heading style={{ ...heading, fontSize: '16px' }}>What happens next</Heading>
            <Text style={body}>
              Ben's team will reach out within 24 hours to schedule your session. If you
              need to reach us first, reply directly to this email.
            </Text>
          </Section>
        ) : (
          <Section>
            <Heading style={{ ...heading, fontSize: '16px' }}>What happens next</Heading>
            <Text style={body}>
              Your gear ships from our US warehouse in 3–5 business days. You'll get a
              tracking link as soon as it goes out.
            </Text>
          </Section>
        )}

        {orderId ? (
          <>
            <Hr style={hr} />
            <Text style={label}>Order reference</Text>
            <Text style={value}>{orderId}</Text>
          </>
        ) : null}

        <Hr style={hr} />
        <Text style={{ fontSize: '12px', color: '#888888', margin: 0 }}>
          OfOurOwn · Chicago · Questions? Reply to this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `Order confirmed — ${data?.productName ?? 'OfOurOwn'}`,
  displayName: 'Order confirmation (customer)',
  previewData: {
    customerName: 'Jordan',
    productName: 'OOO Contrast Hoodie — Black / Ivory',
    amountFormatted: '$135.00',
    orderId: 'ord_sample_123',
    isService: false,
  },
} satisfies TemplateEntry