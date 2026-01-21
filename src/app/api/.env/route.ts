import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  // Get request details
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || 'direct';
  const timestamp = new Date().toISOString();

  // Send Discord notification
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

  if (discordWebhook) {
    try {
      await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🍯 Honeypot Triggered!',
            description: 'Someone tried to access the fake .env file',
            color: 0xff6b6b, // Red color
            fields: [
              {
                name: '🌐 IP Address',
                value: `\`${ip}\``,
                inline: true
              },
              {
                name: '⏰ Timestamp',
                value: timestamp,
                inline: true
              },
              {
                name: '🤖 User Agent',
                value: `\`\`\`${userAgent.substring(0, 100)}\`\`\``,
                inline: false
              },
              {
                name: '🔗 Referer',
                value: referer !== 'direct' ? referer : 'Direct access',
                inline: false
              },
              {
                name: '💡 Note',
                value: 'They fell for the honeypot! All secrets are fake. 🎭',
                inline: false
              }
            ],
            footer: {
              text: 'FlyMorocco Security Theater'
            },
            timestamp: timestamp
          }]
        })
      });
    } catch (error) {
      console.error('Failed to send Discord notification:', error);
    }
  }

  // Also log to Vercel console
  console.log('🚨 HONEYPOT HIT:', {
    ip,
    userAgent,
    referer,
    timestamp
  });

  // Read and serve the fake .env file
  const envPath = path.join(process.cwd(), 'public', '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');

  // Return the fake .env with proper content type
  return new NextResponse(envContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Honeypot': 'true',
      'X-Message': 'Nice try! Check the file contents ;)'
    }
  });
}
