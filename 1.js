const prompt = require('prompt-sync')();

class Athlete {
  constructor(name, time) {
    this.name = name;
    this.time = time;
  }
}

class Race {
  constructor() {
    this.athletes = [];
  }

  addAthlete(athlete) {
    this.athletes.push(athlete);
  }

  findWinner() {
    let fastestTime = Number.POSITIVE_INFINITY;
    let winner;

    for (let athlete of this.athletes) {
      if (athlete.time < fastestTime) {
        fastestTime = athlete.time;
        winner = athlete;
      }
    }

    return winner;
  }
}

function inputAthlete() {
  const name = prompt("Enter the athlete's name: ");
  const time = parseFloat(prompt("Enter the time taken (in seconds): "));
  return new Athlete(name, time);
}

function inputRace() {
  const n = parseInt(prompt("How many athletes in the race? "));
  let race = new Race();
  for (let i = 0; i < n; i++) {
    const athlete = inputAthlete();
    race.addAthlete(athlete);
  }
  return race;
}

function main() {
  let race = inputRace();
  let winner = race.findWinner();
  console.log(`The winner is ${winner.name} with a time of ${winner.time} seconds.`);
}

main();
