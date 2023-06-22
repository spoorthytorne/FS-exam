const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

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

async function inputAthlete() {
  const name = prompt("Enter the athlete's name: ");
  const time = parseFloat(prompt("Enter the time taken (in seconds): "));
  return new Athlete(name, time);
}

async function insertAthlete(db, athlete) {
  const collection = db.collection('athletes');
  await collection.insertOne(athlete);
  console.log('Athlete inserted successfully.');
}

async function findWinner(db) {
  const collection = db.collection('athletes');
  const athletes = await collection.find().toArray();
  const race = new Race();
  race.athletes = athletes;
  const winner = race.findWinner();
  console.log(`The winner is ${winner.name} with a time of ${winner.time} seconds.`);
}

async function updateAthlete(db) {
  const name = prompt("Enter the athlete's name to update: ");
  const collection = db.collection('athletes');
  const athlete = await collection.findOne({ name });

  if (athlete) {
    console.log("Enter the updated information:");
    const updatedAthlete = await inputAthlete();
    await collection.updateOne({ name }, { $set: updatedAthlete });
    console.log('Athlete updated successfully.');
  } else {
    console.log('Athlete not found.');
  }
}

async function deleteAthlete(db) {
  const name = prompt("Enter the athlete's name to delete: ");
  const collection = db.collection('athletes');
  const athlete = await collection.findOne({ name });

  if (athlete) {
    await collection.deleteOne({ name });
    console.log('Athlete deleted successfully.');
  } else {
    console.log('Athlete not found.');
  }
}

async function main() {
  const url = 'mongodb+srv://spoorthyt:mongodb@cluster0.mjpr7sm.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'racedb';

  const client = new MongoClient(url);

  try {
    await client.connect();

    const db = client.db(dbName);

    let n = parseInt(prompt("How many athletes in the race? "));
    for (let i = 0; i < n; i++) {
      const athlete = await inputAthlete();
      await insertAthlete(db, athlete);
    }

    await findWinner(db);

    console.log('------');
    console.log('Update and Delete Operations:');
    console.log('1. Update Athlete');
    console.log('2. Delete Athlete');
    const option = parseInt(prompt('Enter the option: '));

    switch (option) {
      case 1:
        await updateAthlete(db);
        break;
      case 2:
        await deleteAthlete(db);
        break;
      default:
        console.log('Invalid option.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

main();
