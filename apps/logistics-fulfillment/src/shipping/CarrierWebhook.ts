import { NextApiRequest, NextApiResponse } from 'next';
import { ShippingService } from './shipping.service';
import type { CarrierWebhookPayload } from '@workspace/types/inventory';
import crypto from 'crypto';

/**
 * Validates the HMAC signature sent by the courier to ensure payload authenticity.
 */
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return hash === signature;
}

export default async function carrierWebhookHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const signature = req.headers['x-carrier-signature'] as string;
    const webhookSecret = process.env.CARRIER_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
      return res.status(401).json({ error: 'Missing webhook signature or configuration.' });
    }

    const rawBody = JSON.stringify(req.body);
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      return res.status(403).json({ error: 'Invalid webhook signature.' });
    }

    const payload = req.body as CarrierWebhookPayload;
    
    // Process the validated event
    await ShippingService.processCarrierUpdate(payload);

    // Acknowledge receipt to the carrier immediately
    return res.status(200).json({ received: true });
    
  } catch (error: any) {
    console.error('Carrier Webhook Processing Error:', error);
    // Return a 500 so the carrier's retry queue knows to attempt redelivery
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}