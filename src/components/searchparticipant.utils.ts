import { Participants, Participant } from '../types/global.types';

export function convertLevelToScore(level: string): number {
  switch (level) {
    case 'A':
      return 5;
    case 'B':
      return 3.75;
    case 'C':
      return 2.5;
    case 'D':
      return 1.25;
    default:
      return 0;
  }
}

export function convertScoreToLevel(score: number): string {
  if (score >= 5) {
    return 'A';
  } else if (score >= 3.75) {
    return 'B';
  } else if (score >= 2.5) {
    return 'C';
  } else if (score >= 1.25) {
    return 'D';
  } else {
    return '';
  }
}

export function isEveryValueLevel(values: (string | number)[]): boolean {
  // If there are numbers in the array, return false
  if (values.some((value) => typeof value === 'number')) {
    return false;
  }

  return values.every((value) => ['A', 'B', 'C', 'D'].includes(String(value)));
}

export function assignScoreToLevel(
  participants: Participants,
  property: string
): Participants {
  return participants.map((participant: Participant) => {
    const score = convertLevelToScore(String(participant?.[property]) || '');
    return { ...participant, [property]: score };
  });
}
