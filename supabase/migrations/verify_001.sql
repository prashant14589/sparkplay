-- ── Verify migration 001 ran on your live Supabase project ──────────────────
-- Run this in: https://supabase.com/dashboard/project/_/sql
--
-- Expected: both queries return rows. If either returns 0 rows, the migration
-- hasn't run yet — go to supabase/migrations/001_subscription_and_ai_usage.sql
-- and run its contents in the SQL editor.

-- Check 1: profiles table exists with correct columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;
-- Expected columns: id, full_name, subscription_tier, subscription_status,
--                   stripe_customer_id, stripe_subscription_id, updated_at

-- Check 2: ai_usage table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'ai_usage'
ORDER BY ordinal_position;
-- Expected columns: id, user_id, action, created_at

-- Check 3: trigger exists (auto-creates profile on new signup)
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
-- Expected: 1 row

-- Check 4: your own profile row was created (replace with your user ID from auth.users)
-- SELECT * FROM public.profiles LIMIT 5;

-- ── If migration HAS run but your test account has no profile row ────────────
-- Run this to manually create one for your account (replace email):
--
-- INSERT INTO public.profiles (id, full_name, subscription_tier, subscription_status)
-- SELECT id, raw_user_meta_data->>'full_name', 'pro', 'active'
-- FROM auth.users
-- WHERE email = 'prashant07303@gmail.com'
-- ON CONFLICT (id) DO UPDATE
--   SET subscription_tier = 'pro', subscription_status = 'active';
