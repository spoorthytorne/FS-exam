const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://spoorthyt:mongodb@cluster0.mjpr7sm.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const athleteSchema = new mongoose.Schema({
  name: String,
  time: Number
});

athleteSchema.virtual('isWinner').get(function () {
  return this === this.parent().winner;
});

const Athlete = mongoose.model('Athlete2', athleteSchema);

class Race {
  constructor() {
    this.athletes = [];
    this.winner = null;
  }

  addAthlete(athlete) {
    this.athletes.push(athlete);
  }

  findWinner() {
    let fastestTime = Number.POSITIVE_INFINITY;

    for (let athlete of this.athletes) {
      if (athlete.time < fastestTime) {
        fastestTime = athlete.time;
        this.winner = athlete;
      }
    }

    return this.winner;
  }
}

async function inputAthlete() {
  const name = prompt("Enter the athlete's name: ");
  const time = parseFloat(prompt("Enter the time taken (in seconds): "));
  return new Athlete({ name, time });
}

async function inputRace() {
  const n = parseInt(prompt("How many athletes in the race? "));
  let race = new Race();
  for (let i = 0; i < n; i++) {
    const athlete = await inputAthlete();
    race.addAthlete(athlete);
    await athlete.save();
    console.log(`Athlete ${athlete.name} saved successfully.`);
  }
  return race;
}

async function updateAthlete() {
  const name = prompt("Enter the athlete's name to update: ");
  const athlete = await Athlete.findOne({ name });

  if (athlete) {
    console.log("Enter the updated information:");
    const updatedAthlete = await inputAthlete();
    athlete.name = updatedAthlete.name;
    athlete.time = updatedAthlete.time;
    await athlete.save();
    console.log('Athlete updated successfully.');
  } else {
    console.log('Athlete not found.');
  }
}

async function deleteAthlete() {
  const name = prompt("Enter the athlete's name to delete: ");
  const athlete = await Athlete.findOne({ name });

  if (athlete) {
    await Athlete.deleteOne({ _id: athlete._id });
    console.log('Athlete deleted successfully.');
  } else {
    console.log('Athlete not found.');
  }
}

async function main() {
  let race = await inputRace();
  let winner = race.findWinner();
  winner = await Athlete.findById(winner._id);
  winner.isWinner = true;
  await winner.save();
  console.log(`The winner is ${winner.name} with a time of ${winner.time} seconds.`);

  console.log('------');
  console.log('Update and Delete Operations:');
  console.log('1. Update Athlete');
  console.log('2. Delete Athlete');
  const option = parseInt(prompt('Enter the option: '));

  switch (option) {
    case 1:
      await updateAthlete();
      break;
    case 2:
      await deleteAthlete();
      break;
    default:
      console.log('Invalid option.');
  }

  mongoose.disconnect();
}

main();
