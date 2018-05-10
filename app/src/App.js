import React, { Component } from 'react';
import './App.css';
import Header from './Header.js';
import MainContainer from './MainContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
          <div className="validReservation">
              <div className="validBox">
                  Réservation validée avec succès !
              </div>
          </div>
        <Header />
        <div className="imgContainer">
          <span><b>RESERVEZ VOTRE SALLE DE REUNION</b></span>
        </div>
        <MainContainer />
      </div>
    );
  }
}

export default App;
