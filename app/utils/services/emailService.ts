import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../config/email';
import type { UserData } from '../types';

const transporter = nodemailer.createTransport({
  service: EMAIL_CONFIG.service,
  auth: EMAIL_CONFIG.auth
});

function formatEmailContent(userData: UserData): string {
  const locationInfo = userData.location
    ? `
    Location Information:
    - Latitude: ${userData.location.latitude}
    - Longitude: ${userData.location.longitude}
    - Accuracy: ${userData.location.accuracy} meters
    - Timestamp: ${new Date(userData.location.timestamp).toISOString()}
    
    Address Information:
    - Country: ${userData.location.address?.country || 'N/A'}
    - City: ${userData.location.address?.city || 'N/A'}
    - Street: ${userData.location.address?.street || 'N/A'}
    - Postal Code: ${userData.location.address?.postalCode || 'N/A'}
    - Full Address: ${userData.location.address?.formattedAddress || 'N/A'}`
    : '\nLocation: Not available';

  return `
    New User Visit Details:
    
    Timestamp: ${userData.timestamp}
    IP Address: ${userData.ipAddress}
    ${locationInfo}
    
    Browser Information:
    - Name: ${userData.browser.name}
    - Version: ${userData.browser.version}
    
    Operating System:
    - Name: ${userData.os.name}
    - Version: ${userData.os.version}
    
    Device:
    - Model: ${userData.device.model || 'N/A'}
    - Type: ${userData.device.type || 'N/A'}
    - Vendor: ${userData.device.vendor || 'N/A'}
    
    Screen:
    - Resolution: ${userData.screen.width}x${userData.screen.height}
    - Color Depth: ${userData.screen.colorDepth}
    
    Additional Information:
    - Language: ${userData.language}
    - Platform: ${userData.platform}
    - Referrer: ${userData.referrer || 'Direct visit'}
    
    User Agent: ${userData.userAgent}
  `;
}

export async function sendUserDataEmail(userData: UserData): Promise<void> {
  const content = formatEmailContent(userData);
  await transporter.sendMail({
    from: EMAIL_CONFIG.defaultEmail,
    to: EMAIL_CONFIG.defaultEmail,
    subject: EMAIL_CONFIG.subject,
    text: content
  });
}