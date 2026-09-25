'use client';

import UAParser from 'ua-parser-js';

export function getBrowserInfo() {
  const parser = new UAParser();
  return parser.getResult();
}

export function getScreenInfo() {
  return {
    width: window.screen.width,
    height: window.screen.height,
    colorDepth: window.screen.colorDepth,
  };
}

export function getSystemInfo() {
  return {
    language: navigator.language,
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    referrer: document.referrer,
  };
}