-- Create a test table
CREATE TABLE IF NOT EXISTS test_playground (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add a comment
COMMENT ON TABLE test_playground IS 'Test table created in playground branch';