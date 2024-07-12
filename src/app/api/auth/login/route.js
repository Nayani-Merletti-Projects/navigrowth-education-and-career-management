import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });
  
  try {
    await client.connect();

    const { username, password } = await request.json();
    
    // Split the username to handle the combined username|email format
    const [usernameOrEmail] = username.split('|');

    const result = await client.query(
      'SELECT * FROM id WHERE username LIKE $1 AND password = $2',
      [`%${usernameOrEmail}%`, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return NextResponse.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } else {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Login failed", error: error.message }, { status: 500 });
  } finally {
    await client.end();
  }
}