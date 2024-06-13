export type Filters = {
  participant: string;
  property: string;
  summary: Summary;
};

export type Summary = 'Lowest' | 'Highest' | 'Average' | string;

export type Radio = 'summary' | 'participant';

export type Participant = {
  Participant: string | null;
  Enthusiasm: string | number | null;
  MBOLevel: string | number | null;
  Reliability: string | number | null;
  Total: string | number | null;
} & {
  [key: string]: string | number;
};

export type Participants = Participant[];
