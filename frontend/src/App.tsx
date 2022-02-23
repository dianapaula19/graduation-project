import React from 'react';
import AuthentificationPage from './components/templates/AuthentificationPage/AuthentificationPage';
import { Action } from './components/templates/AuthentificationPage/AuthentificationPage.types';

function App() {
  return (
    <AuthentificationPage action={Action.login} />
  );
}

export default App;
