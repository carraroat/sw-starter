type StatsRow = { data: string; updated_at: number };

type QueryRow = {
  term: string;
  type: string;
  duration_ms: number;
  created_at: number;
};

export type { StatsRow, QueryRow };
