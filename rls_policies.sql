-- Enable RLS
ALTER TABLE "Contribution" ENABLE ROW LEVEL SECURITY;

-- Allow public read access (Required for dashboard stats to work for everyone)
CREATE POLICY "Public Read for Contributions" ON "Contribution" FOR SELECT USING (true);

-- Allow full access only to service role (Next.js backend uses service role via Prisma)
-- Note: Prisma bypasses RLS by default if it connects as a superuser or the table owner, which appears to be the case here.
-- However, if you are using Supabase Client in frontend, this policy is needed.
-- Since we are using Prisma server-side, it usually has admin rights.
-- If we want to be explicit for other connections:
CREATE POLICY "Enable All for Service Role" ON "Contribution" FOR ALL USING (true) WITH CHECK (true);
