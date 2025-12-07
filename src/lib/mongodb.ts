import { MongoClient, Db } from 'mongodb';

const uri:string = process.env.MONGODB_URI||'';
const dbName = process.env.MONGODB_DB_NAME || 'nexusforge';

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set');
}

let client: MongoClient | null = null;
let db: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri,{
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000
});
    await client.connect();
  }

  db = client.db(dbName);
  return db;
}

export async function getAnalyticsCollection() {
  const database = await connectToDatabase();
  return database.collection('page_views');
}

export async function getDb() {
  return connectToDatabase();
}
