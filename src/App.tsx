import React, { useState, useEffect } from 'react';
import './App.scss';
import data from './data.json';
import logo from './assets/ltp-logo.png';
import ParticipantCard from './components/ParticipantCard';

// Define the ParticipantData interface with nullable (absent) properties to prevent crashes
export interface ParticipantData {
  Participant: string;
  Enthusiasm: number | null;
  MBOLevel: string | null;
  Reliability: number | null;
  Total: string | null;
}

// Set up participant data state and fetch data when the component mounts
const App: React.FC = () => {
  const [participantData, setParticipantData] = useState<ParticipantData[]>([]);

  useEffect(() => {
    setParticipantData(data);
  }, []);

  return (
    <div className='app'>
      <div className='header'>
        <a href='https:/ltp.nl'>
          <img className='logo' src={logo} alt='logo' />
        </a>
        <h1 className='title'>Look it app!</h1>
      </div>
      <div className='body'>
        {/* Map over participantData and render ParticipantCard for each participant */}
        {participantData.map((participant, index) => (
          <ParticipantCard key={index} participant={participant} />
        ))}
      </div>
    </div>
  );
};

export default App;
