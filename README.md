# Northeastern Greek — Static Prototype

A free-to-host, standalone, responsive website based on the supplied GoDaddy Airo design screenshots. **No GoDaddy website subscription, build step, database, or package installation required.**

## Included

- Home page with chapter/council previews and sample event previews
- Searchable chapter directory with type and council filters
- One reusable profile template for all eight seeded organizations
- Sigma Chi chapter website button linking to https://northeasternsigs.com/
- Month/list event calendar, month navigation, category filters, and event details modal
- For Chapters page with an honest request-draft tool (not a live submission form)
- Responsive mobile navigation and layout
- Clearly labeled fictional demo events, not attributed to real chapters
- Independent/unofficial site disclaimer

## Content editing

Open **data.js** in a text editor. It contains the `CHAPTERS` array, `COUNCILS`, and `DEMO_EVENTS` in one place. The directory, homepage counts, and chapter pages automatically update when you edit these records.

- Add an organization by adding a new object to `CHAPTERS` with a unique `id`.
- Set `website` to a verified `https://` URL, or leave it `null`.
- Leave unverified descriptions, logos, and social links as `null`.
- Only publish actual events after verification and clearly remove/replace fictional examples.
- To enable email-draft outreach, set `SITE_CONFIG.contactEmail` to a real monitored inbox. The page will then open an email draft; it does **not** silently send email.

## Local preview

Double-click `index.html` to preview most features locally, or serve the folder using:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Free Cloudflare Pages deployment (no GitHub needed)

1. Sign in to https://dash.cloudflare.com/ (free account).
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Upload assets** / **Direct Upload** (wording may vary).
3. Create a project named `northeastern-greek` and upload the **ZIP file provided with this project** (or the folder containing `index.html`).
4. Deploy. Cloudflare will provide a free URL ending in `.pages.dev`.
5. Test Home, Directory, chapter links, Calendar, and mobile layout at that URL.
6. In your Pages project, go to **Custom domains** → **Set up a domain** and add `northeasterngreek.com`.
7. Follow Cloudflare's domain instructions. For an apex/root domain, you will normally add the domain to Cloudflare and update the nameservers at GoDaddy to the two Cloudflare nameservers shown in your account.
8. **Before changing nameservers, copy any existing DNS records (especially email MX/TXT records) into Cloudflare.** Keep the domain registered at GoDaddy; only DNS and hosting move to Cloudflare.
9. Wait for DNS and HTTPS to activate. Optionally redirect `www.northeasterngreek.com` to the apex domain, and later configure your `.org` domain to redirect to the `.com` domain.

The free Cloudflare Pages plan is suitable for a small static prototype subject to Cloudflare's current free-tier limits. Domain renewal fees remain payable to your registrar.

## Limitations / next steps

- The events are **fictional** and clearly marked; no real calendar feeds are connected.
- Chapter listing updates are not stored or submitted to a backend. The For Chapters page can copy a draft, or open a draft email after a real contact email is configured.
- There are no accounts, authentication, analytics, or administrative dashboard yet.
- No claim is made that any organization is currently recognized by Northeastern.
- Site is independently student-built and is not affiliated with Northeastern University.
