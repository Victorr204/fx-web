CREATE TABLE IF NOT EXISTS public.user_portfolios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance numeric NOT NULL DEFAULT 10000,
  starting_balance numeric NOT NULL DEFAULT 10000,
  total_pnl numeric NOT NULL DEFAULT 0,
  win_count integer NOT NULL DEFAULT 0,
  loss_count integer NOT NULL DEFAULT 0,
  total_trades integer NOT NULL DEFAULT 0,
  active_strategy text NOT NULL DEFAULT 'AI Technical Analysis',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.user_trades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  position_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('LONG', 'SHORT')),
  entry_price numeric NOT NULL,
  exit_price numeric NOT NULL,
  quantity numeric NOT NULL,
  pnl numeric NOT NULL,
  pnl_percent numeric NOT NULL,
  open_time timestamptz NOT NULL,
  close_time timestamptz NOT NULL,
  close_reason text NOT NULL CHECK (close_reason IN ('TP', 'SL', 'TRAILING', 'SIGNAL')),
  lesson jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_positions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  position_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('LONG', 'SHORT')),
  entry_price numeric NOT NULL,
  current_price numeric NOT NULL,
  quantity numeric NOT NULL,
  stop_loss numeric NOT NULL,
  take_profit numeric NOT NULL,
  trailing_stop numeric NOT NULL,
  pnl numeric NOT NULL DEFAULT 0,
  pnl_percent numeric NOT NULL DEFAULT 0,
  open_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own portfolio" ON public.user_portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio" ON public.user_portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio" ON public.user_portfolios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own trades" ON public.user_trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON public.user_trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own positions" ON public.user_positions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own positions" ON public.user_positions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own positions" ON public.user_positions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own positions" ON public.user_positions
  FOR DELETE USING (auth.uid() = user_id);

GRANT ALL ON public.user_portfolios TO authenticated;
GRANT ALL ON public.user_trades TO authenticated;
GRANT ALL ON public.user_positions TO authenticated;
