const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const prompt = require('prompt-sync')();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://spoorthyt:mongodb@cluster0.mjpr7sm.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Athlete schema
const athleteSchema = new mongoose.Schema({
  name: String,
  time: Number,
});
const Athlete = mongoose.model('Athlete', athleteSchema);

// Define the Race schema
const raceSchema = new mongoose.Schema({
  athletes: [athleteSchema],
});
const Race = mongoose.model('Race', raceSchema);

// Add Athlete to the Race
app.post('/race/athlete', async (req, res) => {
  const numberOfAthletes = parseInt(prompt("How many athletes do you want to add? "));
  if (isNaN(numberOfAthletes) || numberOfAthletes <= 0) {
    return res.status(400).send('Please provide a valid number of athletes');
  }

  const athletes = [];
  for (let i = 0; i < numberOfAthletes; i++) {
    const name = prompt(`Enter the name of athlete ${i + 1}: `);
    const time = parseFloat(prompt(`Enter the time taken by athlete ${i + 1} (in seconds): `));

    if (!name || isNaN(time)) {
      return res.status(400).send('Please provide valid names and times for all athletes');
    }

    athletes.push(new Athlete({ name, time }));
  }

  try {
    let race = await Race.findOne({});

    if (!race) {
      race = new Race();
    }

    race.athletes.push(...athletes);
    await race.save();

    return res.status(200).send(`${numberOfAthletes} athletes added to the race`);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

// Find the winner of the Race
app.get('/race/winner', async (req, res) => {
  try {
    const race = await Race.findOne({});

    if (!race || race.athletes.length === 0) {
      return res.status(404).send('No race or athletes found');
    }

    let fastestTime = Number.POSITIVE_INFINITY;
    let winner;

    for (let athlete of race.athletes) {
      if (athlete.time < fastestTime) {
        fastestTime = athlete.time;
        winner = athlete;
      }
    }

    return res.status(200).json(winner);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
