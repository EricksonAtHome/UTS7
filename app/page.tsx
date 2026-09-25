'use client';

import { useEffect, useState } from 'react';
import { collectUserData } from './utils/collectors/userDataCollector';
import { LiveLocationTracker } from './utils/services/liveLocationService';
import type { GeoLocation } from './utils/types';

export default function Home() {
  const [location, setLocation] = useState<GeoLocation | null>(null);

  useEffect(() => {
    const tracker = new LiveLocationTracker({
      onLocationUpdate: async (newLocation) => {
        setLocation(newLocation);
        
        // Send updated location to the server
        await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'location_update',
            location: newLocation,
            timestamp: new Date().toISOString(),
          }),
        });
      },
      onError: (error) => {
        console.error('Location tracking error:', error);
      },
    });

    // Initial data collection
    const trackUserVisit = async () => {
      try {
        const userData = await collectUserData();
        await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'initial_visit', ...userData }),
        });
      } catch (error) {
        console.error('Error tracking user visit:', error);
      }
    };

    trackUserVisit();
    tracker.start();

    return () => tracker.stop();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome</h1>
          {location && (
            <div className="text-sm text-gray-600">
              <p>Latitude: {location.latitude.toFixed(6)}</p>
              <p>Longitude: {location.longitude.toFixed(6)}</p>
              <p>Accuracy: {location.accuracy.toFixed(2)}m</p>
              {location.speed && <p>Speed: {location.speed.toFixed(2)} m/s</p>}
              {location.heading && <p>Heading: {location.heading.toFixed(2)}°</p>}
              {location.altitude && <p>Altitude: {location.altitude.toFixed(2)}m</p>}
            </div>
          )}
          <p className="text-gray-600 mt-4">Tracking your location...</p>
        </div>
      </div>
    </main>
  );
}