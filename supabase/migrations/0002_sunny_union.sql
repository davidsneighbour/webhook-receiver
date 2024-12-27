/*
  # Add logs table for application events

  1. New Tables
    - `logs`
      - `id` (uuid, primary key)
      - `level` (text) - log level (info, warn, error)
      - `message` (text) - log message
      - `metadata` (jsonb) - additional context
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on logs table
    - Add policy for authenticated service to insert and read logs
*/

CREATE TABLE IF NOT EXISTS logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can insert logs"
  ON logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can read logs"
  ON logs
  FOR SELECT
  TO authenticated
  USING (true);