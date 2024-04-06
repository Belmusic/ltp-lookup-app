import React, { useState, useEffect } from 'react';
import { ParticipantData } from '../App';
import data from '../data.json';

interface Props {
  participant: ParticipantData;
}

const ParticipantCard: React.FC<Props> = ({ participant }) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [selectedSummary, setSelectedSummary] = useState<
    'Lowest' | 'Highest' | 'Average' | 'Type'
  >('');
  const [selectedOption, setSelectedOption] = useState<
    'participant' | 'summary'
  >('participant');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');

  useEffect(() => {
    // Fetch participant names from the data.json file
    const participantNames = data.map((entry) => entry.Participant);
    setSelectedParticipant(participantNames[0] || ''); // Select the first participant by default
  }, []);

  useEffect(() => {
    // Enable the button only when all selections are made
    if (
      selectedProperty &&
      ((selectedOption === 'participant' && selectedParticipant) ||
        (selectedOption === 'summary' && selectedSummary))
    ) {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  }, [selectedProperty, selectedParticipant, selectedSummary, selectedOption]);

  const handlePropertyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProperty(event.target.value);
    setSelectedParticipant('');
  };

  const handleParticipantChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedParticipant(event.target.value);
    setResultText('');
  };

  const handleSummaryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSummary(
      event.target.value as 'Lowest' | 'Highest' | 'Average' | 'Type'
    );
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value as 'participant' | 'summary');
  };

  const calculateSummary = (): string => {
    // Calculate summary based on selected option
    let summaryValue: string = '';
    if (selectedSummary === 'Lowest') {
      summaryValue = Math.min(
        ...data.map((entry) => entry[selectedProperty])
      ).toString();
    } else if (selectedSummary === 'Highest') {
      summaryValue = Math.max(
        ...data.map((entry) => entry[selectedProperty])
      ).toString();
    } else if (selectedSummary === 'Average') {
      const propertyValues = data.map((entry) => entry[selectedProperty]);
      const average =
        propertyValues.reduce((acc, val) => acc + val, 0) /
        propertyValues.length;
      summaryValue = average.toFixed(1);
    } else if (selectedSummary === 'Type') {
      const propertyType = typeof participant[selectedProperty];
      summaryValue = propertyType === 'number' ? 'Score' : 'Level';
    }
    return summaryValue;
  };

  const handleShowResult = () => {
    // Handle showing the result based on selections
    let result = '';
    if (selectedOption === 'participant') {
      const score = participant[selectedProperty];
      result =
        score !== null
          ? `${selectedParticipant} scored ${score} on ${selectedProperty}`
          : `${selectedParticipant} has no score for ${selectedProperty}`;
    } else if (selectedOption === 'summary') {
      if (
        selectedProperty === 'Total' &&
        participant[selectedProperty] === null
      ) {
        result = `${selectedParticipant} has no score for ${selectedProperty}`;
      } else if (selectedSummary === 'Average') {
        result = `The average score for ${selectedProperty} is ${calculateSummary()}`;
      } else {
        result = `The ${selectedSummary.toLowerCase()} ${selectedProperty} is ${calculateSummary()}`;
      }
    }
    setResultText(result);
  };

  return (
    <div className='participant'>
      <div>
        <label>
          <input
            type='radio'
            value='participant'
            checked={selectedOption === 'participant'}
            onChange={handleOptionChange}
          />
          Participant
        </label>
        <label>
          <input
            type='radio'
            value='summary'
            checked={selectedOption === 'summary'}
            onChange={handleOptionChange}
          />
          Summary
        </label>
      </div>
      <div>
        <label>
          Select a competency:
          <select value={selectedProperty} onChange={handlePropertyChange}>
            <option value=''>Select Property</option>
            {Object.keys(participant)
              .filter((property) => property !== 'Participant')
              .map((property, index) => (
                <option key={index} value={property}>
                  {property}
                </option>
              ))}
          </select>
        </label>
      </div>
      {selectedOption === 'participant' && (
        <div>
          <label>
            Select a participant:
            <select
              value={selectedParticipant}
              onChange={handleParticipantChange}
            >
              <option value=''>Select Participant</option>
              {data.map((entry, index) => (
                <option key={index} value={entry.Participant}>
                  {entry.Participant}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {selectedOption === 'summary' && (
        <div>
          <label>
            Select a summary:
            <select value={selectedSummary} onChange={handleSummaryChange}>
              <option value=''>Select Summary</option>
              <option value='Lowest'>Lowest</option>
              <option value='Highest'>Highest</option>
              <option value='Average'>Average</option>
              <option value='Type'>Type</option>
            </select>
          </label>
        </div>
      )}
      <button onClick={handleShowResult} disabled={!showResult}>
        Show me the result!
      </button>
      <div>{resultText}</div>
    </div>
  );
};

export default ParticipantCard;
