'use client';

import { getIpAddress } from '../services/ipService';
import { getBrowserInfo, getScreenInfo, getSystemInfo } from '../services/browserService';
import { getGeoLocation, enrichLocation } from '../services/locationService';
import type { UserData } from '../types';

export async function collectUserData(): Promise<UserData> {
  const [ipAddress, geoLocation] = await Promise.all([
    getIpAddress(),
    getGeoLocation()
  ]);

  const browserInfo = getBrowserInfo();
  const screenInfo = getScreenInfo();
  const systemInfo = getSystemInfo();
  
  const enrichedLocation = geoLocation ? await enrichLocation(geoLocation) : undefined;

  return {
    timestamp: new Date().toISOString(),
    ipAddress,
    userAgent: systemInfo.userAgent,
    browser: browserInfo.browser,
    os: browserInfo.os,
    device: browserInfo.device,
    screen: screenInfo,
    language: systemInfo.language,
    platform: systemInfo.platform,
    referrer: systemInfo.referrer,
    location: enrichedLocation,
  };
}