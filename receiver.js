// Minimal receiver for UXA (Annotator) events + feedback
// Runs on http://127.0.0.1:8765 by default
// Usage: npm i express ws && node receiver.js

const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const PORT = process.env.UXA_PORT ? Number(process.env.UXA_PORT) : 8765;

const app = express();
app.use((req,res,next)=>{res.set('Access-Control-Allow-Origin','*');res.set('Access-Control-Allow-Headers','content-type');res.set('Access-Control-Allow-Methods','POST, OPTIONS');if(req.method==='OPTIONS')return res.sendStatus(204);next();});
app.use('/feedback', express.json({ limit: '50mb' }));
app.post('/feedback', (req, res) => {
  try {
    const payload = req.body || {};
    console.log('\n--- FEEDBACK (compact or full) ---');
    console.log(JSON.stringify(payload, null, 2));
    // TODO: invoke your Codex CLI to act on boiler_plate here
    // e.g., spawn('node', ['cli.js', '--apply', JSON.stringify(payload)])
  } catch (e) { console.error('feedback error', e); }
  res.json({ ok: true });
});

app.use('/events', express.text({ type: 'application/x-ndjson', limit: '10mb' }));
app.post('/events', (req, res) => {
  try {
    const lines = String(req.body || '').split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const evt = JSON.parse(line);
        console.log('event:', evt);
        // TODO: route incremental events to your CLI (optional)
      } catch { /* ignore bad line */ }
    }
  } catch (e) { console.error('events error', e); }
  res.sendStatus(204);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', ws => {
  ws.on('message', msg => {
    try {
      const frame = JSON.parse(String(msg));
      if (frame.type === 'hello') {
        console.log('ws hello:', frame.page?.url, 'target:', frame.target);
      } else if (frame.type === 'event') {
        console.log('ws event:', frame.event);
      } else if (frame.type === 'feedback') {
        console.log('ws feedback:', JSON.stringify(frame.payload));
        // TODO: invoke your Codex CLI for boiler_plate here
      }
    } catch (e) { console.error('ws message error', e); }
  });
  try { ws.send(JSON.stringify({ type: 'ack' })); } catch {}
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`UXA receiver listening on http://127.0.0.1:${PORT}\n- POST /events (NDJSON)\n- POST /feedback (JSON)\n- WS   /ws`);
});
