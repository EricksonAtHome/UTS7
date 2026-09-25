'use client';

import axios from 'axios';
import type { GeoLocation, EnrichedLocation } from '../types';

export async function getGeoLocation(): Promise<GeoLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          speed: position.coords.speed || null,
          heading: position.coords.heading || null,
          altitude: position.coords.altitude || null,
          altitudeAccuracy: position.coords.altitudeAccuracy || null,
        });
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}

export async function enrichLocation(location: GeoLocation): Promise<EnrichedLocation> {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
    );

    const address = response.data.address;
    return {
      ...location,
      address: {
        country: address.country,
        city: address.city || address.town || address.village,
        street: address.road,
        postalCode: address.postcode,
        formattedAddress: response.data.display_name,
      },
    };
  } catch (error) {
    console.error('Error enriching location data:', error);
    return location;
  }
}