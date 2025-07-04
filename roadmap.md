# Flymorocco - Road map

1. Security

This is the most important aspect for FlyMorocco.

Data Handling
[ ] Encrypt sensitive data in transit (HTTPS only) and optionally at rest (if storing PII).
[x] Do not persist data unless required. Your tmp cleanup is working! PDF files auto-deleted after email. Add scheduled cleanup for orphaned files.
[x] Sanitize input: never trust client data. Use Zod validation like you do, but also double-check server-side sanitation for fields that might end up in email or PDF - @src/lib/security/escapeHTML.ts

Email Security
[x] Use DKIM/SPF/DMARC if sending from custom domain.
[x] Resend domain connection - working again! (Classic IT magic fix)
[x] Add Google reCAPTCHA to public forms (ContactForm, BookingForm, Annexe2Form, Annexe2and4Form) - implemented with v3 invisible verification.
[x] Transform script injection through form into harmless strings - @src/lib/security/escapeHTML.ts

⸻

2. Legal & Compliance

You’re collecting passport numbers, nationality, and addresses. That’s high-sensitivity PII.

Regulations to comply with:
[x] GDPR (for EU users):
[x] Add clear privacy policy (you did it!)
[x] Provide ability to opt out and request deletion
[x] Avoid storing unnecessary data (data minimization principle)
Moroccan data laws:
[ ] Not well documented internationally, but generally permissive.
[x] You’re on safe ground as long as you explain where data goes.
[x] Emailing PDFs: Add a disclaimer in the email (“Do not share this email; it contains personal documents…”)

⸻

3. Performance

You’re doing a lot of client-side form rendering, PDF generation, and emailing.
[ ] Minify and tree-shake unused code with Next.js build.
[ ] Offload PDF/email generation to background jobs in the future (queues like Bull or hosted workers like Vercel Cron + storage).
[ ] Preload site meta / GeoJSON or split the Map component to avoid blocking initial render.

⸻

4. UX/UI

You’re already doing great here, but in production:
[x] Disable form submission button after click to prevent double submit (isPending state implemented across all forms).
[x] Use aria-\* attributes for accessibility (you’re using labels correctly—great!).
[x] Add loading indicators for PDF generation and email sending (isPending shows "process" vs "submit" text).

⸻

5. DevOps / Hosting

You’ll want:
[x] CI/CD Pipeline: GitHub + Vercel for testing. Need to adapt for Morocco server deployment.
Error logging:
[ ] Use Vercel Monitoring, or plug in Sentry or LogRocket for client-side errors.
[ ] Log PDF generation errors clearly server-side.
[x] Secrets management: Do not commit .env.local. Use Vercel’s environment variable manager.

⸻

6. Internationalization

You’ve done great prep with next-intl, but make sure:
[x] Default locale fallback is set (properly configured in /src/i18n/request.js to fallback to 'en').
[x] User can manually switch languages (if not now, later).
[x] PDF content is also localized—especially if you’ll have forms in Arabic or French. The PDF content needs to be in French for the Moroccan CAA

⸻

7. Long-Term Maintenance

Since you’re solo:
[x] Document your form schemas, input/output formats, and translation keys.
[ ] Consider building a content dashboard for future updates (like updating airspace zones, adding site guides, etc.)
[x] Add tests for your Zod schemas, especially with the dynamic discriminator logic (annexe2 vs annexe2and4).

⸻

8. Morocco Server Deployment

Since you're deploying to your own server (not Vercel):
[x] Set up HTTPS with SSL certificate (Already configured and validated!)
[x] Static hosting approach - no Node.js server needed for shared hosting
[x] No PM2/process management needed - static files
[ ] Configure server firewall and security updates
[ ] Set up automated backups for JSON data files
[ ] Configure domain DNS to point to your server
[ ] Test email sending from your server (not Vercel functions)
[ ] Set up monitoring/uptime checks for your server

⸻

9. Rate Limiting & Security

For public forms on your server:
[ ] Implement rate limiting (per IP) for form submissions
[ ] Add request logging and monitoring
[ ] Set up fail2ban or similar for brute force protection
[ ] Configure server-level security headers
[ ] Regular security updates and patches

⸻

10. Analytics & Monitoring

You have Google Analytics setup:
[x] Google Tag Manager configured with consent management
[x] Cookie consent banner implemented
[ ] Set up server-side error monitoring (separate from Vercel)
[ ] Monitor form submission success/failure rates
[ ] Track PDF generation performance

⸻

Optional Advanced Features

Once you go live and stabilize:
[ ] Save drafts of the form locally with localStorage.
[ ] Pre-fill forms via link tokens (e.g., /form?user=abc123) if you invite users.
[ ] Multistep form UX for Annexe 2 and 4—better for non-technical users.

⸻

TL;DR: Your Next Checklist

Area Action
Security tmp cleanup, HTTPS, no persistent storage, input sanitation
Legal GDPR, privacy policy, email disclaimer
Performance Optimize map, defer PDF logic if needed
UX Add feedback loaders, input validation, ARIA attributes
DevOps Secrets, logging, CI/CD, environment separation
I18n Confirm fallbacks, extend to PDFs later
Docs Write out schema structure and known flows
