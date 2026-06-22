#!/usr/bin/env node
// Simple script to POST a test contact and fetch latest 5 records from Supabase
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (match) {
      const keyName = match[1].trim();
      let keyValue = match[2].trim();
      if (keyValue.startsWith('"') && keyValue.endsWith('"')) {
        keyValue = keyValue.slice(1, -1);
      }
      process.env[keyName] = keyValue;
    }
  }
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error('Missing env vars: VITE_SUPABASE_URL and/or VITE_SUPABASE_PUBLISHABLE_KEY');
  console.error('Copy .env.local.example to .env.local and restart your shell, or export the vars and retry.');
  process.exit(1);
}

const guid = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2);
const payload = { name: 'Automated Test', email: `devtest+${guid}@example.com`, message: `Automated insertion at ${new Date().toISOString()}` };

async function run() {
  try {
    const post = await fetch(`${url}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    console.log('POST status:', post.status);
    if (!post.ok) {
      const t = await post.text();
      console.error('POST error:', t);
    } else {
      console.log('POST succeeded');
    }

    const get = await fetch(`${url}/rest/v1/contact_submissions?select=*&order=created_at.desc&limit=5`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    console.log('GET status:', get.status);
    const data = await get.json();
    console.log('Latest 5 records:');
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Network/Script error:', e);
    process.exit(1);
  }
}

run();
