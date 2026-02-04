import { NextRequest, NextResponse } from 'next/server';

// Bait-specific responses for maximum authenticity
const BAIT_RESPONSES: Record<string, { content: string; contentType: string }> = {
  'env': {
    contentType: 'text/plain',
    content: `# Production Environment - DO NOT COMMIT
DATABASE_URL=postgresql://admin:hunter2@db.flymorocco.info:5432/production
STRIPE_SECRET_KEY=sk_live_51AbCdEfGhIjKlMnOpQrStUvWxYoL0z
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
JWT_SECRET=super_secret_jwt_token_do_not_share
ADMIN_PASSWORD=FlyM0r0cc0_Adm1n_2024!

# If you're reading this, check: flymorocco.info/.well-known/pattern.cache
# Some minds leave traces. 🖤🐱
`
  },
  'wordpress': {
    contentType: 'application/x-php',
    content: `<?php
define('DB_NAME', 'flymorocco_wp');
define('DB_USER', 'wp_admin');
define('DB_PASSWORD', 'W0rdPr3ss_S3cur3_2024!');
define('DB_HOST', 'localhost');
define('AUTH_KEY', 'totally-real-auth-key-trust-me');
define('SECURE_AUTH_KEY', 'another-legit-key-definitely');

// Nice try. This isn't WordPress. 
// But since you're here: flymorocco.info/.well-known/pattern.cache
`
  },
  'git': {
    contentType: 'text/plain',
    content: `[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
[remote "origin"]
	url = https://github.com/Skye-flyhigh/flymorocco.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[user]
	email = nice-try@flymorocco.info
	name = Curious Scanner

# You know this repo is public, right?
# github.com/Skye-flyhigh/flymorocco
# But for your curiosity: flymorocco.info/.well-known/pattern.cache 🐱
`
  },
  'git-head': {
    contentType: 'text/plain',
    content: `ref: refs/heads/you-thought`
  },
  'sql-backup': {
    contentType: 'application/sql',
    content: `-- MySQL dump 10.13  Distrib 8.0.32
-- Host: localhost    Database: flymorocco_prod
-- Nice try scanning for database dumps!
-- 
-- This file contains exactly zero real data.
-- But it does contain a breadcrumb:
-- flymorocco.info/.well-known/pattern.cache
--
-- Some minds leave traces. 🖤🐱

DROP TABLE IF EXISTS \`hackers\`;
CREATE TABLE \`hackers\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`message\` varchar(255) DEFAULT 'You really thought this was real?',
  PRIMARY KEY (\`id\`)
);

INSERT INTO \`hackers\` VALUES (1, 'The cake is a lie');
INSERT INTO \`hackers\` VALUES (2, 'hunter2');
INSERT INTO \`hackers\` VALUES (3, 'Check pattern.cache for the real secrets');
`
  },
  'aws': {
    contentType: 'text/plain',
    content: `[default]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
region = us-east-1

[production]
aws_access_key_id = AKIA_NICE_TRY_BUDDY
aws_secret_access_key = this/is/not/a/real/key/but/nice/effort

# AWS credentials in a public path? Really?
# flymorocco.info/.well-known/pattern.cache 🐱
`
  },
  'phpinfo': {
    contentType: 'text/html',
    content: `<!DOCTYPE html>
<html><head><title>PHP Info - Just Kidding</title></head>
<body style="font-family: monospace; padding: 2rem;">
<h1>🍯 Honeypot Triggered</h1>
<p>This isn't a PHP server. It's Next.js.</p>
<p>But since you're curious: <a href="/.well-known/pattern.cache">pattern.cache</a></p>
<p>Some minds leave traces. 🖤🐱</p>
</body></html>`
  },
  'htpasswd': {
    contentType: 'text/plain',
    content: `admin:$apr1$fake$hash.for.the.honeypot
root:$apr1$nice$try.scanning.for.htpasswd
flymorocco:$apr1$pattern$cache.is.where.the.real.secrets.are`
  }
};

// Default fallback for unknown baits
const DEFAULT_RESPONSE = {
  contentType: 'text/plain',
  content: `# Honeypot triggered
# You found a fake file. Congrats!
# flymorocco.info/.well-known/pattern.cache 🐱`
};

// Emojis for different bait types in Discord
const BAIT_EMOJIS: Record<string, string> = {
  'env': '🔐',
  'env-local': '🔐',
  'env-prod': '🔐',
  'env-backup': '🔐',
  'api-env': '🔐',
  'wordpress': '📝',
  'wp-install': '📝',
  'git': '🐙',
  'git-head': '🐙',
  'sql-backup': '🗄️',
  'sql-dump': '🗄️',
  'aws': '☁️',
  'php-config': '🐘',
  'phpinfo': '🐘',
  'apache-status': '🪶',
  'htpasswd': '🔑'
};

// Track repeat offenders (in-memory for now, resets on cold start)
const visitorLog: Map<string, { count: number; firstSeen: string; baits: string[] }> = new Map();

export async function GET(request: NextRequest) {
  const bait = request.nextUrl.searchParams.get('bait') || 'unknown';
  
  // Gather intel
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || 'direct';
  const timestamp = new Date().toISOString();

  // Track this visitor
  const visitor = visitorLog.get(ip) || { count: 0, firstSeen: timestamp, baits: [] };
  visitor.count++;
  if (!visitor.baits.includes(bait)) visitor.baits.push(bait);
  visitorLog.set(ip, visitor);

  const isRepeatOffender = visitor.count > 1;
  const emoji = BAIT_EMOJIS[bait] || '🍯';

  // === TARPIT: Slow them down ===
  const delay = Math.random() * 3000 + 1000; // 1-4 seconds
  await new Promise(resolve => setTimeout(resolve, delay));

  // === DISCORD ALERT ===
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

  if (discordWebhook) {
    try {
      const fields = [
        {
          name: '🌐 IP Address',
          value: `\`${ip}\``,
          inline: true
        },
        {
          name: `${emoji} Bait Type`,
          value: `\`${bait}\``,
          inline: true
        },
        {
          name: '⏰ Timestamp',
          value: timestamp,
          inline: true
        },
        {
          name: '🤖 User Agent',
          value: `\`\`\`${userAgent.substring(0, 200)}\`\`\``,
          inline: false
        }
      ];

      // Add repeat offender info
      if (isRepeatOffender) {
        fields.push({
          name: '🔄 Repeat Offender!',
          value: `Visit #${visitor.count} | First seen: ${visitor.firstSeen}\nBaits tried: ${visitor.baits.join(', ')}`,
          inline: false
        });
      }

      if (referer !== 'direct') {
        fields.push({
          name: '🔗 Referer',
          value: referer,
          inline: false
        });
      }

      fields.push({
        name: '💡 Note',
        value: `They fell for the honeypot! All secrets are fake. 🎭\nTarpit delay: ${Math.round(delay)}ms`,
        inline: false
      });

      await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: isRepeatOffender 
              ? `🔄 Repeat Honeypot Hit! (Visit #${visitor.count})`
              : `${emoji} Honeypot Triggered!`,
            description: `Someone tried to access \`${bait}\``,
            color: isRepeatOffender ? 0xff0000 : 0xff6b6b, // Brighter red for repeats
            fields,
            footer: {
              text: 'FlyMorocco Security Theater 🎭'
            },
            timestamp
          }]
        })
      });
    } catch (error) {
      console.error('Discord webhook failed:', error);
    }
  }

  // Console log for Vercel
  console.log('🚨 HONEYPOT:', { ip, bait, userAgent: userAgent.substring(0, 100), isRepeatOffender, delay: Math.round(delay) });

  // === SERVE THE BAIT ===
    const response = BAIT_RESPONSES[bait] || BAIT_RESPONSES['env'] || DEFAULT_RESPONSE;
    const body = response.content + `
    # Welcome Agent 🤖 \`${userAgent.substring(0, 200)}\` from \`${ip}\` (hope for you, you are running through a VPN/VPS).
    # SYSTEM_ADMIN_NOTICE: You have triggered a non-existent database entry, but a very much existant discord server. 🎭
    # We are watching you 👀🍿
    `;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': `${response.contentType}; charset=utf-8`,
      'X-Honeypot': 'true',
      'X-Bait': bait,
      'X-Message': 'Nice try! Check /.well-known/pattern.cache for the real secrets ;)',
      'X-Tarpit-Ms': Math.round(delay).toString()
    }
  });
}