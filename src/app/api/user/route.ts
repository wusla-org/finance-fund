import { NextResponse, NextRequest } from 'next/server';
import { db, User } from '@/lib/db';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, department } = body;

    const newUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: name || 'Anonymous Donor',
        department: department || 'General',
        contributions: 0,
        visits: 1,
        joinedAt: new Date().toISOString(),
        achievements: [],
    };

    db.createUser(newUser);

    // Set a cookie for the user ID
    const response = NextResponse.json(newUser);
    response.cookies.set('userId', newUser.id);

    return response;
}

export async function GET(request: NextRequest) {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = db.getUser(userId);

    if (!user) {
        // User ID in cookie but not in DB? Maybe deleted.
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Increment visits on load? Or separate endpoint? 
    // Let's do it here for simplicity of the "load" event.
    const updatedUser = db.updateUser(userId, { visits: (user.visits || 0) + 1 });

    return NextResponse.json(updatedUser);
}
