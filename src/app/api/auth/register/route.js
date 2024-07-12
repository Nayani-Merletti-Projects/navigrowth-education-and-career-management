import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });
  
  try {
    await client.connect();

    // Check if the table exists and create it if it doesn't
    await client.query(`
      CREATE TABLE IF NOT EXISTS id (
        id INTEGER PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        skills JSON,
        path VARCHAR(255),
        goals JSON
      )
    `);

    const { username, email, password } = await request.json();
    const combinedUsername = `${username}|${email}`;
    console.log("Received registration data:", { username, email }); // Don't log passwords

    // Check if the user already exists
    const existingUser = await client.query(
      'SELECT * FROM id WHERE username LIKE $1 OR username LIKE $2',
      [`${username}|%`, `%|${email}`]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: "Username or email already exists" },
        { status: 400 }
      );
    }

    // Get the next available id
    const maxIdResult = await client.query('SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM id');
    const nextId = maxIdResult.rows[0].next_id;

    // Insert new user
    const result = await client.query(
      'INSERT INTO id (id, username, password, skills, path, goals) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [nextId, combinedUsername, password, '[]', null, '[]']
    );

    console.log("Database insertion result:", result);

    return NextResponse.json(
      { message: "User registered successfully", userId: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Detailed registration error:", error);
    return NextResponse.json(
      { message: "Registration failed", error: error.message },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}