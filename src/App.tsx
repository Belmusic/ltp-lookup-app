import React, { lazy, Suspense } from 'react';
import './App.scss';
import logo from './assets/ltp-logo.png';
const SearchParticipant = lazy(() => import('./components/SearchParticipant'));

const App: React.FC = () => (
  <div className='app'>
    <div className='header'>
      <a href='https:/ltp.nl'>
        <img className='logo' src={logo} alt='logo' />
      </a>
      <h1 className='title'>Look it app!</h1>
    </div>
    <div className='body' style={{ backgroundColor: 'hotpink' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParticipant />
      </Suspense>
    </div>
  </div>
);

export default App;
