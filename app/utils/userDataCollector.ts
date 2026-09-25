'use client';

import axios from 'axios';
import UAParser from 'ua-parser-js';
import { collectGeoLocation } from './geoLocationCollector';
import { enrichLocationData, type EnrichedLocation } from './locationEnricher';

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

export async function collectUserData(): Promise<UserData> {
  const ipResponse = await axios.get('https://api.ipify.org?format=json');
  const ipAddress = ipResponse.data.ip;

  const parser = new UAParser();
  const browserInfo = parser.getResult();

  // Collect GPS location
  const geoLocation = await collectGeoLocation();
  const enrichedLocation = geoLocation ? await enrichLocationData(geoLocation) : undefined;

  return {
    timestamp: new Date().toISOString(),
    ipAddress,
    userAgent: navigator.userAgent,
    browser: browserInfo.browser,
    os: browserInfo.os,
    device: browserInfo.device,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
    },
    language: navigator.language,
    platform: navigator.platform,
    referrer: document.referrer,
    location: enrichedLocation,
  };
}