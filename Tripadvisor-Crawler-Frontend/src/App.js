import React from 'react';
import './App.css';
import logo from './tripadvisor_logo.png'; 
import Form from './components/Form';
import RestaurantsList from './components/RestaurantsList';

class App extends React.Component {
  state = {
    restaurants: []
  }

  handleFormSubmit = (restaurants) => {
    this.setState({ restaurants });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Form onScrape={this.handleFormSubmit} /> 
          <h2>Résultats de la recherche:</h2>
          <div className="results">
            <RestaurantsList restaurants={this.state.restaurants} />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
