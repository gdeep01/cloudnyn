const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'sessions.json');

function readDb() {
  try { const raw = fs.readFileSync(DB_PATH, 'utf8'); return JSON.parse(raw || '{}'); } catch { return {}; }
}
function writeDb(data) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }
function getSessionData(sid) { const db = readDb(); return db[sid] || {}; }
function setSessionData(sid, patch) { const db = readDb(); db[sid] = { ...(db[sid] || {}), ...patch }; writeDb(db); }

module.exports = { getSessionData, setSessionData };


