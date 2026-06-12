let client = null;

function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured');
  }

  if (!client) {
    let createClient;
    try {
      ({ createClient } = require('@supabase/supabase-js'));
    } catch {
      throw new Error('@supabase/supabase-js is not installed. Run: npm install');
    }

    const clientOptions = {
      auth: { persistSession: false, autoRefreshToken: false },
    };

    try {
      const ws = require('ws');
      clientOptions.realtime = { transport: ws };
    } catch {
      // Node 22+ has native WebSocket; ws optional on older Node
    }

    client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      clientOptions,
    );
  }

  return client;
}

module.exports = { getSupabase };
