-- ============================================================================
-- NODELIB SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT (WITH FULL PAYMENTS ANALYTICS)
-- Copy and paste this script into your Supabase Dashboard > SQL Editor > Run
-- ============================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Books Catalog Table
CREATE TABLE IF NOT EXISTS public.books (
  id TEXT PRIMARY KEY,
  no TEXT DEFAULT '005.1 NLB',
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  color TEXT DEFAULT '#4F46E5',
  color_end TEXT DEFAULT '#312E81',
  category TEXT DEFAULT 'Software Engineering',
  tags TEXT[] DEFAULT ARRAY['programming'],
  stock INTEGER DEFAULT 25,
  rating NUMERIC DEFAULT 4.8,
  review_count INTEGER DEFAULT 24,
  featured BOOLEAN DEFAULT FALSE,
  bestseller BOOLEAN DEFAULT FALSE,
  short_desc TEXT,
  full_desc TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT,
  total NUMERIC NOT NULL DEFAULT 0,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Delivered',
  payment_method TEXT DEFAULT 'RAZORPAY',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  book_id TEXT,
  title TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Payments Analytics & Transactions Table
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id TEXT,
  user_email TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  payment_gateway TEXT NOT NULL, -- 'RAZORPAY', 'UPI', 'CARD', 'NETBANKING'
  transaction_ref TEXT UNIQUE NOT NULL, -- Gateway reference/UTR (e.g., pay_Kz91jsa812)
  status TEXT DEFAULT 'captured', -- 'captured', 'pending', 'failed', 'refunded'
  payment_method_details JSONB, -- Details like { "card_last4": "4242", "vpa": "user@okaxis" }
  gateway_fee NUMERIC DEFAULT 0, -- 2% payment processing fee
  tax NUMERIC DEFAULT 0, -- GST
  net_payout NUMERIC DEFAULT 0, -- amount - gateway_fee
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create User Library (Digital Shelf Entitlements)
CREATE TABLE IF NOT EXISTS public.user_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  reading_progress INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- 7. Create User Wishlist Table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- 8. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATIC PROFILE TRIGGER (ON NEW AUTH USER SIGN UP)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id::TEXT,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Books Policies
DROP POLICY IF EXISTS "Public can view all books" ON public.books;
CREATE POLICY "Public can view all books" ON public.books FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert books" ON public.books;
CREATE POLICY "Admins can insert books" ON public.books FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can update books" ON public.books;
CREATE POLICY "Admins can update books" ON public.books FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Admins can delete books" ON public.books;
CREATE POLICY "Admins can delete books" ON public.books FOR DELETE USING (true);

-- User Profiles Policies
DROP POLICY IF EXISTS "Public profiles select" ON public.profiles;
CREATE POLICY "Public profiles select" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update profile" ON public.profiles;
CREATE POLICY "Users can update profile" ON public.profiles FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Users can insert profile" ON public.profiles;
CREATE POLICY "Users can insert profile" ON public.profiles FOR INSERT WITH CHECK (true);

-- User Library Policies
DROP POLICY IF EXISTS "Public library select" ON public.user_library;
CREATE POLICY "Public library select" ON public.user_library FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public library insert" ON public.user_library;
CREATE POLICY "Public library insert" ON public.user_library FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public library update" ON public.user_library;
CREATE POLICY "Public library update" ON public.user_library FOR UPDATE USING (true);

-- User Orders Policies
DROP POLICY IF EXISTS "Public orders select" ON public.orders;
CREATE POLICY "Public orders select" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public orders insert" ON public.orders;
CREATE POLICY "Public orders insert" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public order items select" ON public.order_items;
CREATE POLICY "Public order items select" ON public.order_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public order items insert" ON public.order_items;
CREATE POLICY "Public order items insert" ON public.order_items FOR INSERT WITH CHECK (true);

-- Payments Analytics Policies
DROP POLICY IF EXISTS "Public payments select" ON public.payments;
CREATE POLICY "Public payments select" ON public.payments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public payments insert" ON public.payments;
CREATE POLICY "Public payments insert" ON public.payments FOR INSERT WITH CHECK (true);

-- User Wishlist Policies
DROP POLICY IF EXISTS "Public wishlist select" ON public.wishlist;
CREATE POLICY "Public wishlist select" ON public.wishlist FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public wishlist all" ON public.wishlist;
CREATE POLICY "Public wishlist all" ON public.wishlist FOR ALL USING (true);

-- User Subscriptions Policies
DROP POLICY IF EXISTS "Public subscriptions select" ON public.subscriptions;
CREATE POLICY "Public subscriptions select" ON public.subscriptions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public subscriptions all" ON public.subscriptions;
CREATE POLICY "Public subscriptions all" ON public.subscriptions FOR ALL USING (true);

-- ============================================================================
-- SEED INITIAL BOOKS DATA (SAFE ON CONFLICT)
-- ============================================================================
INSERT INTO public.books (id, no, title, author, price, original_price, color, color_end, category, tags, stock, rating, review_count, featured, bestseller, short_desc, full_desc, pdf_url)
VALUES
('refactor-repeat', '005.1 VOS', 'Refactor & Repeat', 'M. Voss', 499, 799, '#4F46E5', '#3730A3', 'Software Engineering', ARRAY['refactoring','legacy code','clean code'], 24, 4.8, 38, true, true, 'A field guide to untangling legacy systems one small, safe commit at a time.', 'Refactor & Repeat delivers pragmatic strategies for modernizing legacy codebases without screeching feature development to a halt.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('concurrency-notebook', '005.1 KHA', 'The Concurrency Notebook', 'R. Khatri', 599, 899, '#0284C7', '#0369A1', 'Systems & Architecture', ARRAY['async','threads','concurrency'], 18, 4.9, 42, true, false, 'Notes on races, deadlocks, and the mental models that keep concurrent code sane.', 'Concurrency is notorious for subtle bugs that only manifest at 3 AM under production load.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('systems-below-fold', '004.6 OYE', 'Systems Below the Fold', 'D. Oyelaran', 699, 999, '#059669', '#047857', 'Distributed Systems', ARRAY['distributed systems','networking','backend'], 12, 4.7, 29, true, false, 'What actually happens between the request and response across distributed nodes.', 'Behind every modern web application lies a tangled web of distributed nodes and consensus protocols.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('typed-true', '005.1 FEN', 'Typed & True', 'S. Fenwick', 449, 649, '#7C3AED', '#5B21B6', 'Programming Languages', ARRAY['typescript','types','design patterns'], 31, 4.9, 51, true, true, 'Using a type system as a design tool, not just a linter with opinions.', 'Static types are often viewed as safety rails. Typed & True reframes them as interactive modeling tools.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('query-craft', '005.7 NAS', 'Query Craft', 'I. Nasser', 549, 799, '#D97706', '#B45309', 'Databases', ARRAY['sql','databases','performance'], 19, 4.8, 34, false, true, 'Schema design and query patterns that hold up once real users show up.', 'Designing a database schema for 100 million rows while keeping p99 response times under 20ms.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('container-almanac', '004.2 PRK', 'The Container Almanac', 'L. Park', 579, 849, '#DB2777', '#9D174D', 'DevOps & Cloud', ARRAY['docker','kubernetes','devops'], 15, 4.6, 22, false, false, 'A season-by-season guide to running containers without losing weekends.', 'Building ultra-slim multi-stage images and tuning Linux cgroups v2 for Kubernetes.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('clean-terminal', '004.2 ABE', 'Clean Terminal', 'T. Abernathy', 399, 599, '#EA580C', '#C2410C', 'Developer Productivity', ARRAY['cli','shell','developer tools'], 28, 4.7, 31, false, false, 'Small, composable shell habits for people who live in the terminal.', 'Master streams, pipes, jq data wrangling, fzf search, and automated dotfiles.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('algorithms-scale', '005.1 CHU', 'Algorithms at Scale', 'W. Chu', 749, 1199, '#0D9488', '#0F766E', 'Computer Science', ARRAY['algorithms','performance','data structures'], 9, 4.9, 47, false, false, 'What changes about your favorite algorithms once N stops being small.', 'Cache-oblivious algorithms, Bloom Filters, HyperLogLog, and SIMD vectorization.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('api-field-guide', '005.3 MOR', 'The API Field Guide', 'C. Moreau', 479, 699, '#9333EA', '#6B21A8', 'Software Engineering', ARRAY['rest','graphql','api design'], 22, 4.8, 39, false, false, 'Designing interfaces that are still pleasant to use two years and four teams later.', 'Error payload standardization, cursor pagination, rate limiting algorithms, and OpenAPI 3.1.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  author = EXCLUDED.author;
