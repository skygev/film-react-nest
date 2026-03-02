const fs = require('node:fs');
const path = require('node:path');
const { MongoClient } = require('mongodb');

async function main() {
  const mongoUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/afisha';
  const dbName = new URL(mongoUrl).pathname.replace(/^\//, '') || 'afisha';
  const stubPath = path.resolve(__dirname, 'mongodb_initial_stub.json');
  const seedData = JSON.parse(fs.readFileSync(stubPath, 'utf-8'));

  const client = new MongoClient(mongoUrl);
  await client.connect();

  try {
    const db = client.db(dbName);
    const films = db.collection('films');

    await films.deleteMany({});
    if (seedData.length > 0) {
      await films.insertMany(seedData);
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
