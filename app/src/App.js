import React, { Component } from 'react';
import './App.css';
import Header from './Header.js';
import stationFPicture from './stationF.jpg';
const req = new XMLHttpRequest();

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      rooms: []
    }
  }

  componentDidMount(){
    req.open("GET", "http://localhost:3001/rooms?capacity=10&equipements=TV");
      req.onloadend = (e) => {
      if (typeof e.target.response === 'string') {
          this.setState({rooms: JSON.parse(e.target.response)});
      }
    };
    req.send(null);
  }

  render() {
    console.log(this.state.rooms);
    return (
      <div className="App">
        <Header />
        <div className="imgContainer">
          <span><b>RESERVEZ VOTRE SALLE DE REUNION</b></span>
        </div>
      </div>
    );
  }
}

export default App;
