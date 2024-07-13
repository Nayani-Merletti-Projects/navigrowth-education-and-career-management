import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request) {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });
  
  try {
    await client.connect();
    console.log("Connected to database");

    const { username, password } = await request.json();
    console.log("Login attempt for:", username);

    const [usernameOrEmail] = username.split('|');
    console.log("Searching for user with:", usernameOrEmail);

    const result = await client.query(
      'SELECT * FROM id WHERE username LIKE $1',
      [`%${usernameOrEmail}%`]
    );
    console.log("Query result:", result.rows);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log("User found:", user.username);
      
      console.log("Stored hashed password:", user.password);
      console.log("Provided password:", password);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Is password valid:", isPasswordValid);
      
      if (isPasswordValid) {
        console.log("Login successful");
        return NextResponse.json({ 
          message: "Login successful", 
          user: { id: user.id, username: user.username.split('|')[0] }
        });
      } else {
        console.log("Invalid password");
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
      }
    } else {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Login failed", error: error.message }, { status: 500 });
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}