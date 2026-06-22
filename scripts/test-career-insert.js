#!/usr/bin/env node
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
  process.exit(1);
}

// Include resume_link (empty string) to satisfy NOT NULL resume_link column if present
const payload = { name: 'Automated Test', email: `devtest+${Date.now()}@example.com`, position: 'Engineer', resume_link: '' };

async function run() {
  try {
    const post = await fetch(`${url}/rest/v1/career_applications`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    console.log('POST status:', post.status);
    const text = await post.text();
    console.log('POST response:', text);
  } catch (e) {
    console.error('Network/Script error:', e);
    process.exit(1);
  }
}

run();
