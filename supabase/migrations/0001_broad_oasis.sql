/*
  # Create webhooks table and security policies

  1. New Tables
    - `webhooks`
      - `id` (uuid, primary key)
      - `activity` (text)
      - `datestamp` (timestamptz)
      - `customer` (text)
      - `source` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on webhooks table
    - Add policy for authenticated service to insert webhooks
    - Add policy for authenticated service to read webhooks
*/

CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity text NOT NULL,
  datestamp timestamptz NOT NULL,
  customer text NOT NULL,
  source text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can insert webhooks"
  ON webhooks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can read webhooks"
  ON webhooks
  FOR SELECT
  TO authenticated
  USING (true);