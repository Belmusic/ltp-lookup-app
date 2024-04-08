import React, { useState, useEffect } from 'react';

// External JSON data
import participants from '../common/data.json';

// Components
import Selector from './Selector';
import RadioButton from './RadioButton';

// Constants and utilities
import {
  alphaRegex,
  competencies,
  participantNames,
  summaries,
} from './searchparticipant.common';
import {
  convertLevelToScore,
  isEveryValueLevel,
  assignScoreToLevel,
  convertScoreToLevel,
} from './searchparticipant.utils';

// Types
import { Filters, Radio, Participants } from '../types/global.types';

const SearchParticipant: React.FC = () => {
  // State hooks for managing filters, radio selection, and search result
  const [filters, setFilters] = useState<Filters>({
    participant: '',
    property: '',
    summary: '',
  });
  const [radio, setRadio] = useState<Radio>('participant');
  const [result, setResult] = useState<string>('');

  // Handler for select change events
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for radio button change events
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Empty the filters when the radio button is changed
    setFilters({ participant: '', property: '', summary: '' });

    setRadio(e.target.name as Radio);
  };

  // Function to calculate summary based on filters
  const calculateSummary = (): string => {
    if (filters.summary === 'Type') {
      // Not possible to determine the type, since participants can have different types of values for the same property, and summary and participant can't be used together
      return `The type of ${filters.property} is 'level'`;
    }

    const participantArray = participants as Participants;
    const propertyValues =
      participantArray.map((p) => p?.[filters.property])?.filter((v) => v) ||
      [];

    // Return a message if propertyValues is empty, or if every value is null or undefined
    if (propertyValues.length === 0 || propertyValues.every((v) => !v)) {
      return 'None of the participants have a score for this property';
    }

    // If every value is a level (string), convert it to a score (number)
    if (isEveryValueLevel(propertyValues)) {
      const scoredParticipants = assignScoreToLevel(
        participantArray,
        filters.property
      )?.filter((p) => p?.[filters.property]);

      if (filters.summary === 'Lowest') {
        const lowest = scoredParticipants.reduce((a, b) =>
          a?.[filters.property] < b?.[filters.property] ? a : b
        );

        return `The lowest score for ${
          filters.property
        } is ${convertScoreToLevel(Number(lowest?.[filters.property]))}`;
      } else if (filters.summary === 'Highest') {
        const highest = scoredParticipants.reduce((a, b) =>
          a?.[filters.property] > b?.[filters.property] ? a : b
        );

        return `The highest score for ${
          filters.property
        } is ${convertScoreToLevel(Number(highest?.[filters.property]))}`;
      } else if (filters.summary === 'Average') {
        const average =
          scoredParticipants.reduce(
            (acc, p) => acc + Number(p?.[filters.property]),
            0
          ) / scoredParticipants.length;

        return `The average score for ${
          filters.property
        } is ${convertScoreToLevel(average)}`;
      }
    }

    // All values can be either strings or numbers, so we can use the alphaRegex to determine if it's an alphabetic string or a number string
    const propertyValuesWithScore = propertyValues.map((v) =>
      alphaRegex.test(String(v)) ? convertLevelToScore(String(v)) : Number(v)
    );

    let score = 0;

    if (filters.summary === 'Lowest') {
      score = Math.min(...propertyValuesWithScore);
    } else if (filters.summary === 'Highest') {
      score = Math.max(...propertyValuesWithScore);
    } else if (filters.summary === 'Average') {
      score =
        propertyValuesWithScore.reduce((a, b) => a + b, 0) /
        propertyValuesWithScore.length;

      // Round the score to 2 decimal places
      score = Math.round(score * 100) / 100;
    }

    return `The ${filters.summary.toLowerCase()} score for ${
      filters.property
    } is ${score}`;
  };

  // Function to display participant result
  const participantResult = (): string => {
    const { participant, property } = filters;

    // Find participant by name
    const participantObj:
      | { [key: string]: string | number | null }
      | undefined = participants.find((p) => p.Participant === participant);

    const propertyValue = participantObj?.[property];

    // Property value can be undefined, null, a number or a string. If it's undefined or null return a message
    if (propertyValue === undefined || propertyValue === null) {
      return `${participant} has no score for ${property}`;
    }

    return `${participant} scored ${propertyValue} on ${property}`;
  };

  // Handler for search button click event
  const handleResult = () => {
    let result = 'No result found';

    if (radio === 'participant') {
      result = participantResult();
    } else {
      result = calculateSummary();
    }

    setResult(result);
  };

  // Effect hook to reset result when filters change
  useEffect(() => {
    setResult('');
  }, [filters]);

  return (
    <>
      <div className='box'>
        <div className='box-title'>Competency analyzer</div>
        <div className='explanation'>
          Select the competency that you would like to analyze:
        </div>
        <div className='dropdowns'>
          <div className='dropdown-competency'>
            <Selector
              name='property'
              handleChange={handleChange}
              items={competencies}
              value={filters.property}
              title='Competency'
              placeholder='Select a competency'
            />
          </div>
          <div className='explanation'>
            Now choose the option you want to know more about. Then pick a
            participant or metric:
          </div>
          <div className='radio'>
            <RadioButton
              name='participant'
              checked={radio === 'participant'}
              handleChange={handleRadioChange}
              label='Participant'
            />
            <RadioButton
              name='summary'
              checked={radio === 'summary'}
              handleChange={handleRadioChange}
              label='Summary'
            />
          </div>
          <div className='dropdown-participant'>
            <Selector
              name='participant'
              handleChange={handleChange}
              items={participantNames}
              value={filters.participant}
              title='Participant'
              placeholder='Select a participant'
              disabled={radio === 'summary'}
            />
          </div>
          <div className='dropdown-summary'>
            <Selector
              name='summary'
              handleChange={handleChange}
              items={summaries}
              value={filters.summary}
              title='Summary'
              placeholder='Select a summary'
              disabled={radio === 'participant'}
            />
          </div>
        </div>
        <button
          className={`button ${
            ((radio === 'participant' && filters.participant === '') ||
              filters.property === '' ||
              (radio === 'summary' && filters.summary === '')) &&
            'disabled'
          }`}
          onClick={() => {
            handleResult();
          }}
          disabled={
            (radio === 'participant' && filters.participant === '') ||
            filters.property === '' ||
            (radio === 'summary' && filters.summary === '')
          }
        >
          Search
        </button>
      </div>
      {result !== '' && <p>{result}</p>}
    </>
  );
};

export default SearchParticipant;
