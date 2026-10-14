/**
 * UofT Watch Club registration endpoint.
 * Paste into the spreadsheet via Extensions -> Apps Script, then deploy as a Web app
 * (Execute as: Me, Who has access: Anyone). Each submission becomes a row
 * in the "Registrations" sheet.
 */

const SHEET_NAME = 'Registrations';

const FIELDS = [
  ['name', 'Name'],
  ['memberType', 'Member type'],
  ['email', 'Email'],
  ['program', 'Program'],
  ['year', 'Year'],
  ['experience', 'Experience'],
  ['interests', 'Interests'],
  ['events', 'Event types'],
  ['appleEvent', 'Apple speaker event'],
  ['source', 'Heard about us via'],
  ['involved', 'Wants to help'],
  ['comments', 'Comments'],
  ['emailConsent', 'Email consent'],
];

function doPost(e) {
  const p = e.parameters || {};
  const one = (k) => String((p[k] && p[k][0]) || '').trim().slice(0, 1000);

  // Spam trap: bots fill hidden fields. Pretend success, store nothing.
  if (one('website')) return json({ ok: true });

  const name = one('name');
  const email = one('email');
  const memberType = one('memberType');
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !memberType) {
    return json({ ok: false, error: 'Missing required fields' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    const row = [new Date()].concat(FIELDS.map(([key]) =>
      // checkbox groups arrive as several values with the same key
      (p[key] || []).map((v) => String(v).trim().slice(0, 1000)).join(', ')
    ));
    sheet.appendRow(row.map(safeCell));
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

function doGet() {
  return json({ ok: true, service: 'UofT Watch Club registration' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Submitted at'].concat(FIELDS.map(([, label]) => label)));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, FIELDS.length + 1).setFontWeight('bold');
  }
  return sheet;
}

// Stop submitted text from being interpreted as a spreadsheet formula.
function safeCell(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
