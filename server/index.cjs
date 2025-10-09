const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const { getSessionData, setSessionData } = require('./storage.cjs');

const app = express();
const PORT = process.env.PORT || 8787;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8080';

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

function ensureSid(req, res) {
  let sid = req.cookies.sid;
  if (!sid) {
    sid = crypto.randomBytes(16).toString('hex');
    res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' });
  }
  return sid;
}

// Google OAuth
app.get('/auth/google', (req, res) => {
  const sid = ensureSid(req, res);
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.API_BASE || ''}/auth/google/callback`,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: 'https://www.googleapis.com/auth/youtube.readonly openid email profile',
    state: sid,
    include_granted_scopes: 'true',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.API_BASE || ''}/auth/google/callback`,
      grant_type: 'authorization_code',
    });
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString()
    });
    const data = await r.json();
    setSessionData(state, { google: data });
    res.redirect(`${CLIENT_URL}/dashboard`);
  } catch (e) { res.status(500).send(String(e)); }
});

// Instagram OAuth via Facebook
app.get('/auth/instagram', (req, res) => {
  const sid = ensureSid(req, res);
  const params = new URLSearchParams({
    client_id: process.env.FB_CLIENT_ID,
    redirect_uri: `${process.env.API_BASE || ''}/auth/instagram/callback`,
    response_type: 'code',
    scope: 'public_profile,email,instagram_basic,instagram_manage_insights,pages_show_list',
    state: sid,
  });
  res.redirect(`https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`);
});

app.get('/auth/instagram/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const params = new URLSearchParams({
      client_id: process.env.FB_CLIENT_ID,
      client_secret: process.env.FB_CLIENT_SECRET,
      redirect_uri: `${process.env.API_BASE || ''}/auth/instagram/callback`,
      code,
    });
    const r = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`);
    const short = await r.json();
    const exParams = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: process.env.FB_CLIENT_ID,
      client_secret: process.env.FB_CLIENT_SECRET,
      fb_exchange_token: short.access_token,
    });
    const rr = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${exParams.toString()}`);
    const longToken = await rr.json();
    setSessionData(state, { instagram: longToken });
    res.redirect(`${CLIENT_URL}/dashboard`);
  } catch (e) { res.status(500).send(String(e)); }
});

// Instagram analytics
app.get('/api/instagram/account', async (req, res) => {
  try {
    const sid = req.cookies.sid; if (!sid) return res.status(401).json({ error: 'No session' });
    const sess = getSessionData(sid); if (!sess?.instagram?.access_token) return res.status(401).json({ error: 'Not connected' });
    const token = sess.instagram.access_token;
    const pages = await (await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${token}`)).json();
    const pageId = pages?.data?.[0]?.id;
    if (!pageId) return res.status(400).json({ error: 'No connected page/IG business' });
    const igInfo = await (await fetch(`https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${token}`)).json();
    const igId = igInfo?.instagram_business_account?.id; if (!igId) return res.status(400).json({ error: 'No IG business account linked' });
    const fields = 'id,username,profile_picture_url,followers_count,follows_count,media_count,name';
    const account = await (await fetch(`https://graph.facebook.com/v18.0/${igId}?fields=${fields}&access_token=${token}`)).json();
    const media = await (await fetch(`https://graph.facebook.com/v18.0/${igId}/media?fields=id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count&limit=25&access_token=${token}`)).json();
    const metrics = 'impressions,reach,profile_views,website_clicks,followers_count';
    const insights = await (await fetch(`https://graph.facebook.com/v18.0/${igId}/insights?metric=${metrics}&period=day&access_token=${token}`)).json();
    res.json({ account, media, insights });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// YouTube analytics
app.get('/api/youtube/analytics', async (req, res) => {
  try {
    const sid = req.cookies.sid; if (!sid) return res.status(401).json({ error: 'No session' });
    const sess = getSessionData(sid); if (!sess?.google?.access_token) return res.status(401).json({ error: 'Not connected' });
    const token = sess.google.access_token; const channelId = req.query.channelId;
    const chRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}`, { headers: { Authorization: `Bearer ${token}` } });
    const ch = await chRes.json();
    const search = await (await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=10`, { headers: { Authorization: `Bearer ${token}` } })).json();
    const ids = search.items?.map(i => i.id.videoId).filter(Boolean).join(',');
    let videos = [];
    if (ids) {
      const vd = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}`, { headers: { Authorization: `Bearer ${token}` } })).json();
      videos = vd.items || [];
    }
    res.json({ channel: ch.items?.[0], videos });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// Gemini recommendations
app.post('/api/gemini/recommend', async (req, res) => {
  try {
    const body = req.body;
    const prompt = `Given this analytics JSON, produce actionable recommendations as JSON with keys: summary, nextActions, weeklyPlan (7 items with day,time,contentType,idea,hashtags[3]).\n${JSON.stringify(body)}`;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
    const data = await r.json(); const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}$/); const parsed = match ? JSON.parse(match[0]) : {};
    res.json(parsed);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// Export endpoints
const PDFDocument = require('pdfkit');
app.post('/api/export/pdf', (req, res) => {
  const { analytics, recommendations } = req.body || {};
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
  const doc = new PDFDocument(); doc.pipe(res);
  doc.fontSize(20).text('Social Analytics Report');
  doc.moveDown().fontSize(12).text(JSON.stringify(analytics, null, 2));
  doc.moveDown().fontSize(14).text('Recommendations');
  doc.fontSize(12).text(JSON.stringify(recommendations, null, 2));
  doc.end();
});

app.post('/api/export/csv', (req, res) => {
  const { analytics } = req.body || {};
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="analytics.csv"');
  const rows = [];
  if (analytics?.weeklyData) { rows.push('date,engagement,reach,likes'); analytics.weeklyData.forEach(d => rows.push(`${d.date},${d.engagement},${d.reach},${d.likes}`)); }
  res.send(rows.join('\n'));
});

app.post('/api/export/all', async (req, res) => {
  try {
    const { instagram, youtube, recommendations } = req.body || {};
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="full-report.pdf"');
    const doc = new PDFDocument({ margin: 40 }); doc.pipe(res);
    doc.fontSize(20).text('Full Social Report'); doc.moveDown();
    doc.fontSize(16).text('Instagram Analytics'); doc.fontSize(10).text(JSON.stringify(instagram || {}, null, 2)); doc.moveDown();
    doc.fontSize(16).text('YouTube Analytics'); doc.fontSize(10).text(JSON.stringify(youtube || {}, null, 2)); doc.moveDown();
    doc.fontSize(16).text('AI Recommendations'); doc.fontSize(10).text(JSON.stringify(recommendations || {}, null, 2));
    doc.end();
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

// Stripe
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.post('/api/stripe/create-checkout', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({ mode: 'subscription', line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }], success_url: `${CLIENT_URL}/dashboard`, cancel_url: `${CLIENT_URL}/pricing` });
    res.json({ url: session.url });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});
app.post('/api/stripe/customer-portal', async (req, res) => {
  try {
    const portal = await stripe.billingPortal.sessions.create({ customer: req.body.customerId || undefined, return_url: `${CLIENT_URL}/dashboard` });
    res.json({ url: portal.url });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get('/healthz', (_, res) => res.send('ok'));
app.listen(PORT, () => { console.log(`API server running on http://localhost:${PORT}`); });


