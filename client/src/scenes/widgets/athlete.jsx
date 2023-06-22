import React from 'react';
import WidgetWrapper from 'components/WidgetWrapper';

// Define the Athlete class
class Athlete extends React.Component {
  render() {
    const { name, time, onChange, onRemove } = this.props;

    return (
      <div>
        <label>Athlete's Name:</label>
        <input type="text" name="name" value={name} onChange={onChange} />

        <label>Time Taken (in seconds):</label>
        <input type="number" name="time" value={time} onChange={onChange} />

        <button onClick={onRemove}>Remove</button>
      </div>
    );
  }
}

// Define the RaceApp component
class RaceApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      athletes: [],
      winner: null,
    };
  }

  handleInputChange = (event, index) => {
    const athletes = [...this.state.athletes];
    athletes[index] = {
      ...athletes[index],
      [event.target.name]: event.target.value,
    };
    this.setState({ athletes });
  };

  addAthlete = () => {
    const athletes = [...this.state.athletes];
    athletes.push({ name: '', time: '' });
    this.setState({ athletes });
  };

  removeAthlete = (index) => {
    const athletes = [...this.state.athletes];
    athletes.splice(index, 1);
    this.setState({ athletes });
  };

  calculateWinner = () => {
    const { athletes } = this.state;
    let fastestTime = Number.POSITIVE_INFINITY;
    let winner;

    for (let athlete of athletes) {
      if (athlete.time < fastestTime) {
        fastestTime = athlete.time;
        winner = athlete;
      }
    }

    this.setState({ winner });
  };

  render() {
    const { athletes, winner } = this.state;

    return (
        <WidgetWrapper>
      <div>
        <h2>Race Information</h2>

        {athletes.map((athlete, index) => (
          <Athlete
            key={index}
            name={athlete.name}
            time={athlete.time}
            onChange={(event) => this.handleInputChange(event, index)}
            onRemove={() => this.removeAthlete(index)}
          />
        ))}

        <button onClick={this.addAthlete}>Add Athlete</button>

        <button onClick={this.calculateWinner}>Calculate Winner</button>
        {winner && (
          <p>
            The winner is {winner.name} with a time of {winner.time} seconds.
          </p>
        )}
      </div>
      </WidgetWrapper>
    );
  }
}

export default RaceApp;