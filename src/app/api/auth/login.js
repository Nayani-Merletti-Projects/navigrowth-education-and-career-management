import { sql } from '@vercel/postgres';

export async function POST(request) {
  const { username, password } = await request.json();

  try {
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password}`;
    
    if (rows.length > 0) {
      // In a real app, you'd create a session here
      return new Response(JSON.stringify({ message: 'Login successful', user: { id: rows[0].id, username: rows[0].username } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}