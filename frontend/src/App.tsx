import React from 'react';
import AuthentificationPage from './components/templates/AuthentificationPage/AuthentificationPage';
import { AuthentificationAction } from './components/templates/AuthentificationPage/AuthentificationPage.types';

function App() {
  return (
    <AuthentificationPage action={AuthentificationAction.register} />
  );
}

export default App;
