import { NextResponse } from 'next/server';
import { sendUserDataEmail } from '../../utils/services/emailService';
import type { UserData, GeoLocation } from '../../utils/types';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (data.type === 'initial_visit') {
      await sendUserDataEmail(data);
    } else if (data.type === 'location_update') {
      // Send location update email with new coordinates
      await sendUserDataEmail({
        timestamp: data.timestamp,
        location: data.location,
        type: 'location_update',
      });
    }
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}