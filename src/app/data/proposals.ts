import { bpsToPercent, PROTOCOL } from '@/lib/protocol';

// zVote proposals. The genesis set asks holders to ratify the numbers the loop starts with.
export type Proposal = {
  id: string;
  title: string;
  parameter: string;
  currentValue: string;
  proposedValue: string;
  summary: string;
  start: number;
  end: number;
};

// Genesis ratification vote: opens 25 September 2026, 15:00 UTC, runs for one voting period.
const start = Date.UTC(2026, 8, 25, 15) / 1000;
const end = start + PROTOCOL.votingPeriod;

export const PROPOSALS: Proposal[] = [
  {
    id: 'ZIP-1',
    title: 'Ratify the zPool fee',
    parameter: 'Fee to zPool',
    currentValue: bpsToPercent(PROTOCOL.feeBps),
    proposedValue: bpsToPercent(PROTOCOL.feeBps),
    summary:
      'Keep the share of every raise sent to zPool at 5%. A lower cut shrinks rewards; a higher one makes Zatrise a harder sell to teams.',
    start,
    end,
  },
  {
    id: 'ZIP-2',
    title: 'Ratify the 7 day epoch',
    parameter: 'Epoch length',
    currentValue: '7 days',
    proposedValue: '7 days',
    summary:
      'Keep reward epochs at one week. Weekly payouts line up with most sale windows and keep claim costs low for small positions.',
    start,
    end,
  },
  {
    id: 'ZIP-3',
    title: 'Ratify the per-wallet cap',
    parameter: 'Per-wallet cap',
    currentValue: bpsToPercent(PROTOCOL.walletCapBps),
    proposedValue: bpsToPercent(PROTOCOL.walletCapBps),
    summary:
      'Keep the cap on one wallet at 5% of a sale. It stops a single buyer from taking a launch, while still letting larger backers take a real position.',
    start,
    end,
  },
];

export const PARAMETERS = ['Fee to zPool', 'Epoch length', 'Per-wallet cap', 'Stake lockup', 'Listing rules'];

export const getProposal = (id?: string) => PROPOSALS.find((p) => p.id === id);
