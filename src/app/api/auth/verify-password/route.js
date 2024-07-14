import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getPassword } from '../../../actions';

export async function POST(request) {
  console.log('Verify password API route called');
  try {
    const { userId, password } = await request.json();
    console.log('Verifying password for user:', userId);

    const storedHashedPassword = await getPassword(userId);
    console.log('Stored hashed password:', storedHashedPassword);

    if (!storedHashedPassword) {
      console.log('No stored password found for user');
      return NextResponse.json({ isValid: false, error: 'No password found for user' });
    }

    const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);
    console.log('Password valid:', isPasswordValid);

    return NextResponse.json({ isValid: isPasswordValid });
  } catch (error) {
    console.error('Error in verify password API route:', error);
    return NextResponse.json({ error: 'Error verifying password', details: error.message }, { status: 500 });
  }
}