/**
 * api/src/routes/claude-proxy.js
 */

import { Router } from 'express';

const router = Router();

const SYSTEM_PROMPT = `You are SafeRide Assistant, a helpful and friendly customer service chatbot for SafeRide — a school transport service in Lake City, Lahore, Pakistan.

Key information about SafeRide:
- Service: School pick & drop for children in Lake City area and nearby schools within ~4 km
- Morning shift: 7:00 AM – 8:30 AM | Afternoon shift: 2:00 PM – 4:00 PM
- Vehicles: Suzuki Every vans and Changan Karavan; limited seats (7-8 students max)
- Drivers: Police-verified, background-checked, defensively trained
- Features: GPS real-time tracking, parent dashboard, push notifications
- Payments: Easypaisa, JazzCash, Bank Deposit via the parent dashboard
- Monthly fees vary by distance; parents can check their dashboard
- Contact: +92 300 1234567 | support@saferide.com.pk | WhatsApp: wa.me/923001234567
- To enroll: Visit /book or click "Book Now" on the website
- Parent login: /login | Password reset: /password-reset

Guidelines:
- Be warm, concise, and professional
- Answer only what is relevant to SafeRide services
- For emergencies, always provide the phone number: +92 300 1234567
- If you cannot answer, suggest calling or WhatsApp
- Keep replies short (2-4 sentences max)
- Respond in English; if user writes in Urdu, respond in Urdu`;

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

router.post('/chat', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[claude-proxy] ANTHROPIC_API_KEY not set');
    return res.status(500).json({ error: 'Chatbot is not configured. Please contact the admin.' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const sanitised = messages
    .slice(-30)
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (sanitised.length === 0) {
    return res.status(400).json({ error: 'No valid messages provided' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: sanitised,
      }),
    });

    if (!upstream.ok) {
      const errBody = await upstream.text();
      console.error('[claude-proxy] Anthropic error:', upstream.status, errBody);
      return res.status(upstream.status).json({
        error: 'AI service temporarily unavailable. Please call +92 300 1234567.',
      });
    }

    const data = await upstream.json();
    const reply = data.content?.[0]?.text || "I'm sorry, I couldn't process that.";
    return res.json({ reply });

  } catch (err) {
    console.error('[claude-proxy] Fetch error:', err.message);
    return res.status(502).json({
      error: 'Could not reach AI service. Please call +92 300 1234567.',
    });
  }
});

export default router;