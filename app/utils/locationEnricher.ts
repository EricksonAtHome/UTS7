'use client';

import axios from 'axios';
import { GeoLocation } from './geoLocationCollector';

export interface EnrichedLocation extends GeoLocation {
  address?: {
    country?: string;
    city?: string;
    street?: string;
    postalCode?: string;
    formattedAddress?: string;
  };
}

export async function enrichLocationData(location: GeoLocation): Promise<EnrichedLocation> {
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