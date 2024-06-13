import participantData from '../common/data.json';

export const alphaRegex = /^[a-z]+$/i;

export const competencies = [
  {
    key: 'Enthusiasm',
    value: 'Enthusiasm',
  },
  {
    key: 'MBOLevel',
    value: 'MBOLevel',
  },
  {
    key: 'Reliability',
    value: 'Reliability',
  },
  {
    key: 'Total',
    value: 'Total',
  },
];

export const summaries = [
  {
    key: 'Lowest',
    value: 'Lowest',
  },
  {
    key: 'Highest',
    value: 'Highest',
  },
  {
    key: 'Average',
    value: 'Average',
  },
];

// Check if participantData is available before mapping it
export const participantNames = participantData
  ? participantData.map((participant) => ({
      key: participant.Participant,
      value: participant.Participant,
    }))
  : [];
