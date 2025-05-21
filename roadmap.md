# Flymorocco - Road map

1. Security

This is the most important aspect for FlyMorocco.

Data Handling
• Encrypt sensitive data in transit (HTTPS only) and optionally at rest (if storing PII).
• Do not persist data unless required. Your current use of a tmp folder is good—but set up automatic cleanup (cron job or fs-based logic).
• Sanitize input: never trust client data. Use Zod validation like you do, but also double-check server-side sanitation for fields that might end up in email or PDF.

Email Security
• Use DKIM/SPF/DMARC if sending from custom domain.
• Consider using address verification or CAPTCHA if you expose the form publicly.

⸻

2. Legal & Compliance

You’re collecting passport numbers, nationality, and addresses. That’s high-sensitivity PII.

Regulations to comply with:
• GDPR (for EU users):
• Add clear privacy policy (you did it!)
• Provide ability to opt out and request deletion
• Avoid storing unnecessary data (data minimization principle)
• Moroccan data laws:
• Not well documented internationally, but generally permissive.
• You’re on safe ground as long as you explain where data goes.
• Emailing PDFs: Add a disclaimer in the email (“Do not share this email; it contains personal documents…”)

⸻

3. Performance

You’re doing a lot of client-side form rendering, PDF generation, and emailing.
• Minify and tree-shake unused code with Next.js build.
• Offload PDF/email generation to background jobs in the future (queues like Bull or hosted workers like Vercel Cron + storage).
• Preload site meta / GeoJSON or split the Map component to avoid blocking initial render.

⸻

4. UX/UI

You’re already doing great here, but in production:
• Disable form submission button after click to prevent double submit (optional: debounce).
• Use aria-\* attributes for accessibility (you’re using labels correctly—great!).
• Add loading indicators for PDF generation and email sending (to prevent user frustration).

⸻

5. DevOps / Hosting

You’ll want:
• CI/CD Pipeline: GitHub + Vercel is a good default. Add build, test, lint steps.
• Error logging:
• Use Vercel Monitoring, or plug in Sentry or LogRocket for client-side errors.
• Log PDF generation errors clearly server-side.
• Secrets management: Do not commit .env.local. Use Vercel’s environment variable manager.

⸻

6. Internationalization

You’ve done great prep with next-intl, but make sure:
• Default locale fallback is set.
• User can manually switch languages (if not now, later).
• PDF content is also localized—especially if you’ll have forms in Arabic or French.

⸻

7. Long-Term Maintenance

Since you’re solo:
• Document your form schemas, input/output formats, and translation keys.
• Consider building a content dashboard for future updates (like updating airspace zones, adding site guides, etc.)
• Add tests for your Zod schemas, especially with the dynamic discriminator logic (annexe2 vs annexe2and4).

⸻

Optional Advanced Features

Once you go live and stabilize:
• Save drafts of the form locally with localStorage.
• Pre-fill forms via link tokens (e.g., /form?user=abc123) if you invite users.
• Multistep form UX for Annexe 2 and 4—better for non-technical users.

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
