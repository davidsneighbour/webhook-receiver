import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function saveWebhook({ activity, datestamp, customer, source }) {
  const { data, error } = await supabase
    .from('webhooks')
    .insert([{ activity, datestamp, customer, source }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWebhooks() {
  const { data, error } = await supabase
    .from('webhooks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveLog({ level, message, metadata }) {
  const { error } = await supabase
    .from('logs')
    .insert([{ level, message, metadata }]);

  if (error) throw error;
}

export async function getLogs() {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}