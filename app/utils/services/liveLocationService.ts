'use client';

import type { GeoLocation } from '../types';

interface LiveLocationOptions {
  onLocationUpdate: (location: GeoLocation) => void;
  onError?: (error: GeolocationPositionError) => void;
}

export class LiveLocationTracker {
  private watchId: number | null = null;
  private options: LiveLocationOptions;

  constructor(options: LiveLocationOptions) {
    this.options = options;
  }

  start() {
    if (!navigator.geolocation) {
      this.options.onError?.(new GeolocationPositionError());
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: GeoLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          speed: position.coords.speed || null,
          heading: position.coords.heading || null,
          altitude: position.coords.altitude || null,
          altitudeAccuracy: position.coords.altitudeAccuracy || null,
        };
        this.options.onLocationUpdate(location);
      },
      (error) => this.options.onError?.(error),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );
  }

  stop() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}