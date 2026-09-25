export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
}

export interface EnrichedLocation extends GeoLocation {
  address?: {
    country?: string;
    city?: string;
    street?: string;
    postalCode?: string;
    formattedAddress?: string;
  };
}

export interface UserData {
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  browser: any;
  os: any;
  device: any;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
  language: string;
  platform: string;
  referrer: string;
  location?: EnrichedLocation;
}

export interface EmailConfig {
  from: string;
  to: string;
  subject: string;
}