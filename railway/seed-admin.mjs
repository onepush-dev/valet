// Creates the first local account from VALET_ADMIN_USER / VALET_ADMIN_PASSWORD when no accounts exist yet,
// in exactly the format Valet's own `user add` writes (data/users.json, scrypt N=2^15 r=8 p=3), so no setup code
// is needed and nobody else can claim a fresh install. Never touches existing accounts.
import { randomBytes, scrypt } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const DATA = resolve(process.env.VALET_DATA ?? '/data/data');
const USERS = resolve(DATA, 'users.json');
const name = process.env.VALET_ADMIN_USER || 'admin';
const pw = process.env.VALET_ADMIN_PASSWORD || '';
const users = JSON.parse(await readFile(USERS, 'utf8').catch(() => '[]'));
if (users.length) { console.log(`railway: ${users.length} account(s) already exist, not seeding`); process.exit(0); }
if (!/^[a-zA-Z0-9._-]{1,32}$/.test(name)) { console.error('railway: VALET_ADMIN_USER must be letters, numbers, . _ -'); process.exit(1); }
if (pw.length < 8) { console.error('railway: VALET_ADMIN_PASSWORD must be 8+ characters, not seeding'); process.exit(0); }
const SCRYPT = { N: 2 ** 15, r: 8, p: 3, maxmem: 64 * 2 ** 20 };
const salt = randomBytes(16);
const hash = await new Promise((ok, no) => scrypt(pw, salt, 32, SCRYPT, (e, k) => e ? no(e) : ok(k)));
await mkdir(DATA, { recursive: true });
const tmp = `${USERS}.${process.pid}.tmp`;
await writeFile(tmp, JSON.stringify([{ name, hash: hash.toString('base64'), salt: salt.toString('base64'), p: SCRYPT.p, version: 1, created: new Date().toISOString() }], null, 2), { mode: 0o600 });
await rename(tmp, USERS);
console.log(`railway: created owner account "${name}" from VALET_ADMIN_PASSWORD`);
