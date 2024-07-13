import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });
  
  try {
    await client.connect();
    console.log("Connected to database");

    // Drop the existing table
    await client.query('DROP TABLE IF EXISTS id');
    console.log("Dropped existing table");

    // Recreate the table
    await client.query(`
      CREATE TABLE id (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        skills JSON,
        path VARCHAR(255),
        goals JSON
      )
    `);
    console.log("Recreated table");

    return NextResponse.json({ message: "Database cleared and table recreated" });
  } catch (error) {
    console.error("Error clearing database:", error);
    return NextResponse.json({ message: "Failed to clear database", error: error.message }, { status: 500 });
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}