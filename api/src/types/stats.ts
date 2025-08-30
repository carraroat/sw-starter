type StatsRow = { data: string; updated_at: string };

type QueryRow = {
  term: string;
  type: string;
  duration_ms: number;
  created_at: string;
};

export type { StatsRow, QueryRow };
