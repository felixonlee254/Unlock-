import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const sb = createClient(
  'PASTE_SUPABASE_URL',
  'PASTE_SUPABASE_ANON_KEY'
);

export const fmt = c => '$' + (c / 100).toFixed(2);
export const CAPS = { 1: 1000, 2: 2000, 3: 3500, 4: 5000, 5: 10000 };
export const FEE = 10;
