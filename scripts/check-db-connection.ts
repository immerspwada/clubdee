import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
let envContent = '';

try {
    envContent = fs.readFileSync(envPath, 'utf-8');
} catch (error) {
    console.error('Error reading .env.local:', error);
    process.exit(1);
}

const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
    console.log('Checking connection to public schema...');

    // Try to select from a table that should exist (e.g., profiles or just a raw query if possible)
    // We'll try to select count from profiles. Even if empty, it should work if DB is up.
    // If table doesn't exist, we'll get a specific error.

    const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('   Details:', error.details);
        console.error('   Hint:', error.hint);
        console.error('   Code:', error.code);
    } else {
        console.log('✅ Connection successful!');
        console.log(`   Found ${count} profiles.`);
    }
}

checkConnection().catch(console.error);
