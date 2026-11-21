# TSOH relaunch: localization research

Prepared 2026-11-21. Bracketed tags such as [S1] point to the Sources list at the end. Anything marked **unverified** could not be confirmed from a primary source. Repo observations come from a read-only look at `c:\Workflows\Work\TSOH\thesourceofhope`.

> **Decision note (2026-11-21):** This research recommended English + Spanish at launch. The decision taken after it is **English only at launch, built ready for more languages, with Spanish as an optional pre-launch pass translated once by machine**. See [ADR-0004](../adr/0004-localization-ready-english-first.md). The rest of this research (next-intl, Sanity field-level shape, URL strategy, vendor locale support) still applies.

---

## TL;DR recommendations

- **Languages.** Launch with **English + Spanish**. Across Collin, Dallas, Denton and Tarrant counties, Spanish speakers make up **73% of residents with limited English proficiency** (LEP, meaning they speak English less than "very well"): 613k of 843k. Spanish is also the largest LEP group in Plano and Collin County, by more than two to one over any other single language [S1].
- **Next tier.** Add **Vietnamese** (the second-largest single-language LEP group in the region, about 44k, concentrated in Dallas and Tarrant) and **Chinese**, which is the largest non-Spanish LEP group in Plano and Collin. Translate only the service-seeker pages for these: food distribution, how to get help, the event calendar and contact. Do not translate the whole site.
- **Framework.** Use **`next-intl` 4.x**. It declares Next 16 and React 19 support [N3], ships a `proxy.ts` integration [N1], and supports static rendering through `next/root-params` (Next ≥16.3) with `generateStaticParams` [N4].
  - Use `localePrefix: 'as-needed'` so every existing English URL stays unchanged and Spanish lives under `/es/…` [N2].
  - Set `localeDetection: false`. Google advises against redirecting visitors by their perceived language [G1].
  - Save the visitor's explicit language choice in a cookie.
- **Sanity.** Use field-level localization (`sanity-plugin-internationalized-array` v5) for structured types: events, products and team members. Use document-level localization (`@sanity/document-internationalization` v6) for long-form, Portable Text or separately published pages.
  - Both plugin versions support Studio v5 and React 19.2 [C5].
  - Roll out "read-compatible first": deploy queries that work on both the old and new data shapes before migrating or creating any translated content (see §3).
- **SEO.** Use subpaths (`/es`) with self-referencing canonicals, reciprocal `hreflang` links (`en`, `es`; **not** `es-419`, which Google doesn't support [G2]) and an `x-default` pointing at English.
  - Emit alternates only when a translation actually exists, so turn off next-intl's automatic `Link` header [N2].
  - Label the switcher "Español" and "English" in their own languages, and don't use flags [U1].
- **Payments and other services.**
  - Stripe Elements and Checkout support `es` and `es-419` [V1][V2]. Set the Stripe Customer's `preferred_locales` so receipt and invoice emails follow the donor's language [V3].
  - PayPal's `locale` parameter supports `es-US` (sandbox testing needed) [V5].
  - DocuSign translates only its own interface, never the document, so you need **one template per language** [V7][V9].
  - Eventbrite allows **one language per event** (partially verified).
  - Supabase Auth email can be localized with the Send Email Hook, Resend and React Email [V13][V14].
- **Translation workflow.**
  - Keep UI strings as JSON in git. Draft with an LLM or DeepL using a glossary, and have a bilingual person review the pull request.
  - For CMS content, use Sanity AI Assist or Agent Actions to draft, then have a person review in Studio before publishing.
  - Use **professional human translation** for waivers, agreements, privacy policy and donation terms.
  - Don't buy a translation management system (TMS) at launch.
- **Legal.** Federal guidance on serving LEP people changed in 2025–26. Executive Order 14224 revoked EO 13166, DOJ rescinded its guidance, and USDA is revising FNS Instruction 113-1 [L2][L3][L4]. If TSOH receives federal money, or distributes USDA (TEFAP) food through a food bank, **verify current obligations with counsel**. Texas "fair notice" rules for waivers make an accurate Spanish waiver more important, not less [L6].

---

## 1. Which languages? (Census ACS)

**Data.** ACS 2020–2024 5-year estimates, table C16001: language spoken at home by ability to speak English, population aged 5 and over [S1]. LEP means speaks English less than "very well". I computed the LEP totals by adding up the LEP columns of C16001; the bottom row is my own sum of the four counties. Plano sits inside Collin and Denton counties, so it is not added again.

| Geography | Pop. 5+ | Non-English at home | **LEP (% of pop.)** | **Spanish LEP (% of all LEP)** | Next-largest LEP groups (C16001 categories) |
|---|---|---|---|---|---|
| Plano city | 275,557 | 104,662 (38.0%) | **32,930 (12.0%)** | 12,479 (37.9%) | Other Indo-European 5,445 · Chinese 4,882 · Other Asian/Pacific Island 4,310 · Vietnamese 1,348 · Korean 1,008 |
| Collin County | 1,096,003 | 341,827 (31.2%) | **98,709 (9.0%)** | 38,726 (39.2%) | Other Indo-European 15,995 · Chinese 11,612 · Other Asian/Pacific Island 11,456 · Vietnamese 5,467 |
| Dallas County | 2,441,840 | 1,046,737 (42.9%) | **440,340 (18.0%)** | 368,291 (83.6%) | Vietnamese 17,611 · Other Indo-European 12,502 · Other Asian/Pacific Island 11,903 · Other/unspecified 11,201 |
| Denton County | 923,160 | 234,802 (25.4%) | **75,861 (8.2%)** | 44,148 (58.2%) | Other Asian/Pacific Island 8,000 · Korean 6,203 · Other Indo-European 5,920 · Chinese 3,798 · Vietnamese 3,316 |
| Tarrant County | 2,028,780 | 607,261 (29.9%) | **227,868 (11.2%)** | 162,043 (71.1%) | Vietnamese 17,650 · Other Indo-European 13,692 · Other Asian/Pacific Island 7,052 · Other/unspecified 6,910 · Arabic 6,544 |
| **4 counties** | 6,489,783 | 2,230,627 (34.4%) | **842,778 (13.0%)** | 613,208 (72.8%) | Single-language groups: Vietnamese 44,044 · Chinese 25,276 · Korean 15,258 · Arabic 13,993 |

**Detailed languages.** "Other Indo-European" and "Other Asian/Pacific Island" are catch-all groups. They mostly contain South Asian languages (Hindi, Urdu, Gujarati, Telugu, Tamil and others), whose speakers report comparatively high English proficiency. Table B16001 from the ACS 2024 1-year release breaks them out [S2]. The figures below are LEP counts for the largest single languages after Spanish, ranked within each county's top 15 languages by total speakers. They have large margins of error.

- **Collin:** Chinese 13,074 (±2,628), Telugu 7,276 (±2,616), Vietnamese 6,958 (±2,038), Korean 3,847, Arabic 3,814, Hindi 3,733.
- **Dallas:** Vietnamese 15,829 (±3,898), Amharic/Somali/other Afro-Asiatic 7,305 (±4,314), Chinese 5,152, Korean 4,584, Arabic 4,350.
- **Denton:** Korean 6,511 (±2,144), Telugu 3,477, Vietnamese 2,804, Chinese 2,626.
- **Tarrant:** Vietnamese 16,274 (±3,269), Nepali/Marathi/other Indic 6,942 (±2,800), Arabic 6,344, Swahili/other Central, Eastern and Southern African languages 5,282, Chinese 4,089.
- **Plano:** the B16001 breakdown was not available from the source I used (**unverified**). Under C16001, Chinese is Plano's largest single non-Spanish LEP language.

**Recommendation.** The people most affected by language are those looking for services: meal programs, food distribution and other programs. They are the most likely to have limited English proficiency, and the LEP data points to Spanish first by a wide margin.

- **Launch (full site):** English and Spanish. That includes the Volunteer | Give hub, donations, volunteer sign-up and agreements, all transactional email, programs, events and the store.
- **Next tier (service-seeker subset):** Vietnamese and Chinese.
  - Vietnamese because of the region overall: about 44k LEP speakers, roughly 58–59% of Vietnamese speakers in Dallas and Tarrant.
  - Chinese because of TSOH's home base in Plano and Collin.
  - Whether to use Simplified or Traditional Chinese script is a community question (**unverified**; ask partners). A common default is Simplified (`zh-Hans`).
- **Watch list:** Korean (Denton), Arabic (Tarrant; right-to-left script) and Amharic/Somali. Serve these with printed flyers, phone interpretation and browser translation rather than maintained web content.
- **Benchmark only.** HHS's long-standing rule of thumb for translating written documents was any LEP group making up 5% of the eligible population or 1,000 people, whichever is smaller [S4]. Several languages pass 1,000 here. Treat this only as a planning benchmark, because the federal guidance is in flux (see §7).

---

## 2. Next.js 16 App Router i18n

**Next.js's own guidance** [N5] (updated 2026-11-06):

- Put all routes under `app/[lang]` and use **Proxy** (`proxy.ts`, which replaces `middleware.ts` in v16) for locale negotiation.
- Load dictionaries in Server Components.
- Read the locale anywhere on the server with **`next/root-params`**.
- Pre-render each locale with `generateStaticParams`.
- The guide lists these libraries: next-intl, next-international, next-i18n-router, paraglide-next, Lingui, Tolgee, next-intlayer and gt-next.

**What next-intl offers (recommended)**

| Capability | Status |
|---|---|
| Next 16 and React 19 | Latest release is 4.15.3. Peer dependencies are `next ^16.0.0` and `react ^19.0.0` [N3]. |
| Next 16 Proxy | The setup uses `src/proxy.ts` with `createMiddleware(routing)`. Docs note it "was called middleware.ts up until Next.js 16" [N1]. |
| Static rendering | **New:** with `next/root-params` (Next 16.3 or later), `setRequestLocale` is no longer needed. Read the locale in `i18n/request.ts`; `generateStaticParams` is still required. `setRequestLocale` is now documented as the "legacy" stopgap [N1][N4]. |
| Caveat | `next/root-params` "currently doesn't work" in **Route Handlers and Server Actions**, so pass `locale` explicitly in those [N4]. |
| URL prefix | `always` (default), `as-needed`, `never`, or custom prefixes [N2]. |
| Locale detection | Uses Accept-Language and a cookie by default. Turn off with `localeDetection: false`. The `NEXT_LOCALE` cookie defaults to a session cookie and its `maxAge` is configurable [N2]. |
| Localized pathnames | A `pathnames` map such as `'/about': { de: '/über-uns' }`, including dynamic segments. For CMS slugs, the docs say to localize only the static part and take slugs from the CMS [N2]. |
| hreflang | `alternateLinks` (on by default) sends a `Link` header that includes `x-default`. Can be disabled [N2]. |

**Alternatives**

- **Do it yourself, per the Next.js guide.** Fine for two languages, but you would have to build ICU plurals and formatting, typed navigation, the switcher and the alternates yourself [N5].
- **Paraglide JS 2.** Compiler-based and tree-shakable. The Next adapter `@inlang/paraglide-next` is deprecated in favor of using paraglide-js v2 directly [N8]. I could not confirm the maturity of its App Router guide (**unverified**).
- **Lingui.** Has had React Server Component support since v4.10 and relies on an SWC plugin that has historically been sensitive to the Next.js version [N9].
- I did not evaluate next-intlayer, gt-next or Tolgee's SDK in depth.

**Why next-intl.** It is the most mature option, it is the one the Next.js docs list first, it already uses `proxy.ts` and `next/root-params`, its ICU messages are compatible with React Email, and it has first-class `pathnames` and `localePrefix` controls.

**Suggested config sketch**

```ts
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',   // "/about" stays English; Spanish is "/es/about"
  localeDetection: false,      // no Accept-Language redirects (Google guidance)
  alternateLinks: false,       // emit hreflang ourselves, only when a translation exists
});
```

**Repo-specific migration notes**

- The root layout hard-codes `<html lang="en">` (`src/app/layout.tsx`, around line 82). Move it to `src/app/[locale]/layout.tsx` and set `lang={locale}`.
- `src/app/[slug]/page.tsx` (the legacy team-member redirect) is a root-level dynamic segment. It would collide with `[locale]`, so move it to `[locale]/[slug]`.
- `src/lib/format-date.ts` hard-codes `LOCALE = "en-US"`. Make it take the locale as a parameter (see §8 for why Spanish should format as `es-US`).
- The `next.config.ts` redirects (`/giving`, `/awards`, `/serve/*`) need `/es` equivalents.
- API routes (`/api/checkout`, `/api/email/send`, `/api/waiver/*`) must receive `locale` in the request body, because they can't read root params [N4].
- Most program copy is hard-coded in TSX (about 1,200 lines across `src/app/programs/*` and the home page). This is the largest string-extraction job. Decide whether to move it into message JSON or into Sanity (see §3).

---

## 3. Sanity localization

**The two approaches** [C1]:

| | Field-level (`sanity-plugin-internationalized-array`) | Document-level (`@sanity/document-internationalization`) |
|---|---|---|
| Shape | One document. Each field is an array of `{_key, language, value}` items. **From v5 the language lives in `language`, not `_key`** [C2][C3]. | One document per language, linked by a `translation.metadata` document [C4]. |
| Publishing | All languages publish together [C1]. | Each language publishes independently [C1]. |
| Best for | Documents that mix shared and translated fields. Arrays add fewer attributes than objects [C1]. | Language-specific documents, little shared content, and Portable Text [C1]. |
| Cost | Document count unchanged. | About (1 + number of languages) times the documents, plus metadata documents [C4]. The Free plan allows 10k documents and Growth 25k [C9]. |
| Versions | v5.3.10 supports `sanity ^5` and React ^19.2. Its peers include `@sanity/language-filter` [C5]. | v6.3.0 supports `sanity ^5` and requires `internationalized-array ^5.3.10` [C5]. |

The repo's Studio is on `sanity ^5.14.1` and React ^19.2.4, so both plugins are compatible.

**How each content type maps** (from the schemas in `sanity/the-source-of-hope/schemaTypes`)

- **Field-level:** `featuredEvent`, `recurringEvent` and `bannerEvent` (date, location and image are shared; translate title, summary, description and schedule); `product` (price and size shared; translate title, descriptions and impact); `teamMember` and `teamGroup` (translate role and bio, not names).
- **Document-level:** program and landing pages if they move into Sanity, `publication`, and `newsletter`. These are long-form, need localized slugs, and benefit from separate review and publishing.
- **No translation:** `checkoutProvider` (configuration).
- **Field-level publishing risk.** Publishing the English document also pushes any unreviewed Spanish text live. Either add a per-locale "reviewed" flag that the frontend checks, or always fall back to English when the flag is missing.

**GROQ patterns with fallback to English**

```groq
// Field-level (v5 shape)
*[_type == "featuredEvent"]{
  "title":   coalesce(title[language == $lang][0].value,   title[language == "en"][0].value),
  "summary": coalesce(summary[language == $lang][0].value, summary[language == "en"][0].value),
  date, location
}

// Document-level: get the page in $lang, or fall back to the English original
*[_type == "page" && slug.current == $slug && language == "en"][0]{
  "localized": *[_type == "translation.metadata" && references(^._id)][0]
                 .translations[language == $lang][0].value->,
  ...
}
```

The `references()` pattern comes from the plugin README [C4]. While migrating, both plugins recommend matching `language == "en" || _key == "en"` [C2][C4].

**Can the current English-only production site keep reading the same dataset?**

- **Document-level breaks existing queries.** Queries such as `*[_type == "featuredEvent"]` (see `src/lib/sanity-content.ts`) would start returning the Spanish copies too. Fix this by:
  1. backfilling `language: "en"` on existing documents (the plugin requires a language field [C4]);
  2. deploying queries filtered with `(!defined(language) || language == "en")`;
  3. only after both, creating translations.
- **Field-level breaks the field type.** Changing `title` from `string` to `internationalizedArrayString` changes what the live site reads. There are two options:
  - **Additive (safest):** add new fields such as `titleI18n`, then read `coalesce(titleI18n[language==$lang][0].value, titleI18n[language=="en"][0].value, title)`.
  - **Dual-read, then migrate:** deploy queries that handle both the string and array shapes, then run a migration script. Check in Vision how GROQ behaves when filtering a non-array value (**unverified**).
- **Rule of thumb:** ship the reading code before changing the data, and back up first with `sanity dataset export` [C4].

**AI translation in Sanity**

- **AI Assist translation** [C6]
  - Offers both document-level ("Translate document") and field-level ("Translate fields…") translation. It is designed around the two plugins above.
  - **Availability:** "available for all projects on the Growth plan and up", and labeled a paid feature.
  - Supports a `styleguide` of up to 2,000 characters; use it for a glossary of program names.
  - Document translation overwrites existing values.
  - Sanity says it "should never be relied on for critical content without a human being reviewing the results."
- **Agent Actions Translate** (`client.agent.action.translate`) [C7][C8][C9]
  - **Experimental.** Requires `@sanity/client` 7.1 or later and an uploaded schema [C7].
  - Billed in AI credits at $0.05 each. Translating 3 documents into 2 languages costs about 76 credits, roughly 12 per document per language [C8].
  - Free and Growth plans each include 1,000 credits a month [C9]. That covers roughly 80 document-language translations a month.
  - Agent Actions are listed on every plan; AI Assist is listed on Growth [C9].
- **Sanity non-profit plan.** It mirrors Growth and is free within quotas, with 25 users and 3 datasets. You apply with a project ID and should hear back within 14 business days [C10]. The plan page doesn't say whether AI Assist is included (**unverified**). **Apply before launch.**

---

## 4. URLs, SEO and the language switcher

**URL structure.** Use subdirectories (`/es/`): Google says they are low-maintenance on the same host. Google calls URL parameters "not recommended" [G1]. Google wants **separate URLs per language** rather than content that changes by cookie or browser setting [G1].

**Localized vs. shared slugs.** Launch with **shared slugs** (`/es/programs/…`), because the switcher then maps pages one-to-one. Later, use next-intl `pathnames` for a few high-value Spanish entry pages (for example `/es/comida`), and per-locale slugs for document-level CMS pages [N2]. Google does not require translated slugs (this is a judgment call).

**hreflang**

- Google treats HTML `<link>` tags, HTTP headers and sitemaps as equivalent [G2].
- Each version must list itself and all others: "If two pages don't both point to each other, the tags will be ignored" [G2].
- URLs must be fully qualified.
- Codes are ISO 639-1, optionally with a region. **`es-419` isn't supported** [G2]. Use `en`/`es` (or `es-US`).
- `x-default` is the fallback for selectors and auto-redirecting home pages [G2]. Point it at the English URL.
- **Next.js support:**
  - `generateMetadata` `alternates.languages` emits `<link rel="alternate" hreflang>` and resolves relative URLs against `metadataBase` [N7]. The site's `metadataBase` is already `https://thesourceofhope.org`.
  - `sitemap.ts` has supported `alternates.languages` since 14.2 [N6].
  - Next's sitemap example omits the self-reference, so **include `en` (self) and `x-default` explicitly**.

**Canonical tags.** Make each language version self-canonical. Google: "specify a canonical page in the same language, or the best possible substitute language", and it "prefers URLs that are part of hreflang clusters" [G4].

**Untranslated pages.** Google warns against translating only the boilerplate while the main content stays in another language [G1]. If a CMS page has no Spanish version:

- show the English content under `/es/…` with a notice;
- mark it `noindex`;
- leave it out of hreflang and the sitemap.

This is why next-intl's automatic `alternateLinks` should be off.

**Automatic redirects.** Google says to "avoid automatically redirecting" based on perceived language, and "Don't use IP analysis to adapt your content" [G1]. Googlebot crawls without an `Accept-Language` header and mostly from US IP addresses [G3]. Instead:

- use no Accept-Language or IP redirects;
- optionally show a dismissible "¿Prefiere español?" banner when Accept-Language starts with `es`;
- remember an **explicit** choice in a long-lived cookie, and honor it on unprefixed entry pages for returning visitors only. This needs a few lines of custom proxy code, because `localeDetection: false` routes by URL alone [N2].

**Switcher UX**

- Label each language in its own language and mark it up, for example `<a href="/es/…" hreflang="es" lang="es">Español</a>`. USWDS: "Language links should contain a span element with the lang attribute" [U2].
- **No flags:** "Flags represent countries, not languages" [U1].
- With two languages, a single toggle in the header utility bar that links to the **equivalent page** (not the home page), repeated in the footer. USWDS has a two-language pattern and recommends a dropdown for three or more [U2].
- Keep its position and label the same on every page, which helps with WCAG 3.2.3 and 3.2.6 [U4].

---

## 5. Third-party locale support

| Service | How to set the language | Spanish? | Notes |
|---|---|---|---|
| **Stripe Elements / Payment Element** | `locale` in Stripe.js or Elements options | `es` (Spain) and **`es-419` (Latin America)**; also `vi`, `zh`, `zh-TW`, `ko`, `ar`, `auto` [V1] | Recommend `es-419` for a US Hispanic audience (judgment). |
| **Stripe Checkout** | Checkout Session `locale` | `es` and `es-419` (also `vi`, `zh`, `ko`). **`ar` is not in the Checkout enum** [V2] | Use `submit_type: 'donate'` for the "Donate" button label [V2]. |
| **Stripe receipts and invoices** | Customer `preferred_locales` | — | **Receipt emails:** a payment with a Customer uses `preferred_locales`, otherwise the dashboard default; the Checkout locale doesn't apply. A guest payment uses the Checkout locale. **Refund emails for guest payments always use the default language** [V3]. **Invoices (subscriptions):** `preferred_locales`, then the default [V3][V4]. → Set `preferred_locales: ['es-419','es']` on every Customer created from `/es`. |
| **PayPal JS SDK** | `locale` query parameter on the SDK script | The JS SDK table lists US locales `en-US`, `es-US`, `fr-US` and `zh-US`. Examples use the underscore form (`fr_FR`) [V5]. The REST locale-code table lists US Spanish as `es_XC` [V6]. | PayPal recommends leaving it unset (it auto-detects from geolocation and browser), and setting it only to match your site's language [V5]. → Set `locale=es_US` on `/es` pages and **test in sandbox** (format is unverified). Because it is a script parameter, the script must reload after a client-side language switch (inference). |
| **DocuSign eSignature** | Recipient `emailNotification.supportedLanguage` (standard email and signing view). For embedded signing, append `&locale=es` (or `es_MX`) to the recipient-view URL [V7][V8] | Yes. About 44 signing languages; get the exact list from `Accounts:listSupportedLanguages` [V8] | Requires the account setting "Enable custom email and language for each recipient" and the user permission "Allow language selection" [V9]. **Custom subject and body text is not translated** [V7]. A recipient's own saved language preference overrides yours [V9]. DocuSign does not translate document content (the docs don't mention it) → **separate English and Spanish templates**. |
| **Eventbrite** | Per-event language setting (organizer interface, "Build Event Page" → date and time → more options) | Spanish is available in the dropdown (partially verified) | Changes Eventbrite's own page text. **Title, description and ticket names are not translated** (help-centre article seen only in search results; the page itself returned 403) [V10]. The API Text Overrides endpoint takes a `locale` and falls back to "the event's locale" [V11]. I couldn't confirm the `locale` field on the Create Event API (**unverified**). → Make TSOH's own bilingual event pages canonical. Use one Eventbrite listing per event with a Spanish summary paragraph, or a separate Spanish listing for Spanish-focused events. |
| **Supabase Auth email** | Templates are Go templates with `{{ .Data }}` (user metadata) and conditionals [V12] | Possible by branching on `.Data.locale`. The docs don't describe this use case, so it is an inference [V12]. | Better: the **Send Email Hook** replaces built-in sending. Supabase's docs show internationalized subjects and bodies chosen from `user_metadata` (an example with EN, ES and FR), plus a Resend example [V13]. The Staff Portal can likely launch English-only. |
| **Resend / React Email** | Our own templates | — | React Email has an official next-intl guide using `createTranslator` with the locale passed as a prop; its preview server can't see app context [V14]. Store `preferred_locale` on volunteer and donor records, and send weekly reminders and cut-off notices in the stored locale, not the locale of the current request. |

---

## 6. Translation workflow for a small nonprofit

**Options**

| Option | Notes |
|---|---|
| Bilingual staff or volunteers | Best for tone and community fit. Use them as **reviewers**, not first drafters. |
| Professional translator | Required for legal and agreement text (see §7). Look for ATA-certified or legal specialists. Typical rates are **unverified**. |
| Machine translation | **DeepL API:** the Free tier is documented as 500k characters a month, but DeepL also says the Free plan "can no longer be purchased" and the signup page now shows a 1M-character allowance, so this is **unverified** [T4]. **Google Cloud Translation:** first 500k characters a month free (as a $10 credit), then $20 per million [T5]. An **LLM** with a glossary and style guide is comparable and handles placeholders well (judgment). |
| Translation management system | **Crowdin:** free for open-source projects by application; other terms from third parties only (**unverified**). **Lokalise:** its help docs say nonprofits are eligible for a discount on request; reports of a free plan conflict [T2]. **Tolgee:** self-hosted is free with "no support", "up to 10 seats", and open-source projects can get a free business plan [T3]. |

**Recommended lightweight workflow**

- **(a) UI strings in code**
  - Keep `messages/en.json` and `messages/es.json` in the repo, using ICU message syntax through next-intl.
  - Draft Spanish with an LLM or DeepL, using a short **TSOH glossary**: program names, "Hope Beyond Borders", "Volunteer | Give" and the preferred register (for example *usted* vs *tú*).
  - A bilingual reviewer approves the pull request.
  - Add a CI check that fails on missing or extra keys, plus pseudo-localization (strings padded about 40%) to catch layout overflow.
  - Revisit a TMS (Tolgee self-hosted, or Crowdin) only when adding a third language or reviewers who don't use git.
- **(b) CMS content**
  - Author in English.
  - Draft the Spanish with AI Assist (if the non-profit or Growth plan is granted) or with an Agent Actions translate script. Put the glossary in the style guide [C6][C7].
  - A bilingual reviewer edits it in Studio and sets "reviewed: es".
  - The frontend shows Spanish only when it has been reviewed, and otherwise falls back to English with a notice and `noindex`.
- **(c) Legal and agreement documents**
  - Use a professional human translation, reviewed by counsel.
  - Version both languages together, with a version ID stored alongside each signature.
  - Never publish machine translation of these documents without professional review.
  - Re-translate whenever the English changes.

---

## 7. Legal and compliance notes (verify with counsel)

- **Bilingual waivers and volunteer agreements**
  - Texas enforces releases of a party's own negligence only if they give "fair notice": they must meet the **express negligence** rule and be **conspicuous** (for example larger type or contrasting color). Courts treat this as a question of law; there is an actual-knowledge exception [L6].
  - In practice, a Spanish-reading volunteer who signs only an English release weakens fair notice and actual knowledge. The Spanish version must keep the conspicuous formatting and the exact express-negligence wording.
  - Counsel to decide:
    - which language controls. A "the English version controls" clause is common, but may cut against fair notice for someone who reads only Spanish;
    - whether to use a side-by-side bilingual document or separate documents;
    - how minors and guardians sign.
  - Keep a record of which language version each signer saw: the DocuSign template ID, document version and locale.
- **Donation acknowledgments**
  - The IRS lists the required contents of a written acknowledgment: the organization's name, the cash amount or a description of a non-cash gift, and either a statement that no goods or services were provided or a description and good-faith value of what was provided [L1].
  - The IRS page does not address language; I found no rule requiring English (**unverified**).
  - Recommendation: send TSOH's own acknowledgment through Resend in the donor's language, and **include the required statements in English as well**, because tax preparers and auditors work in English. Confirm with your CPA.
  - Don't rely on Stripe's standard receipts as IRS acknowledgments. I didn't verify whether they can carry the required statement (**unverified**).
- **Federal language-access obligations** (only relevant if TSOH receives federal financial assistance)
  - EO 14224 (March 1, 2025) revoked EO 13166 [L3]. DOJ's July 14, 2025 guidance directs agencies to "minimize non-essential multilingual services" [L2]. Whether Title VI duties toward LEP people still bind funding recipients is disputed among commentators (see the search notes).
  - **USDA:** a March 3, 2026 FNS memo modifies FNS Instruction 113-1 [L4]. I saw this only in search results; the PDF returned 403. If TSOH distributes TEFAP or USDA food as a food-bank partner agency, check that partner agreement and the state agency's current civil-rights rules.
  - **Section 1557 (HHS):** applies only to health programs that receive HHS money. The 2024 rule requires a notice of language assistance in English and the 15 most common LEP languages in the state, with full implementation by July 5, 2025 [L5].
  - Treat all of this as **"verify with counsel"**. The safe-harbor benchmark in §1 is for planning only.

---

## 8. UX and design implications

- **Text expansion**
  - Short strings grow the most. W3C cites IBM figures of 200–300% for strings up to 10 characters, falling to about 130% for strings over 70 characters [U3]. The often-quoted ~15–30% for Spanish is **unverified**.
  - Watch buttons and navigation: "Volunteer" becomes "Ser voluntario" and "Planned giving" becomes "Donaciones planificadas".
  - Avoid fixed-width pills, tabs and cards. Allow labels to wrap, and design the Volunteer | Give hub cards for about 1.5× label length.
  - Don't put text inside images or graphics [U3].
- **Fonts** (subsets from Next's bundled font data, `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`)
  - **Spanish:** every character (á é í ó ú ñ ü ¿ ¡) is in the `latin` subset that `next/font` already loads. No change needed.
  - **Vietnamese (next tier):** Inter and Montserrat have a `vietnamese` subset; add it to the `next/font` config. **Urbanist has only `latin` and `latin-ext`**, so Vietnamese headings would render in mixed fonts. Choose a heading font with Vietnamese support for `:lang(vi)` (for example Be Vietnam Pro or Montserrat).
  - **Chinese:** don't self-host CJK web fonts at launch. Use a system font stack under `:lang(zh-Hans)` (PingFang SC, Microsoft YaHei, Noto Sans SC). Allow taller line-height, and avoid italics and letter-spacing on CJK text [U3].
- **Intl formatting**
  - Format Spanish as **`es-US`**, not `es`. Measured on Node 22:
    - `es` gives `1234,50 US$` and 24-hour time ("9:30");
    - `es-US` gives `$1,234.50` and "9:30 a.m.";
    - `es-MX` and `es-419` give `USD 1,234.50`.
  - So use `/es` in URLs and `es-US` for `Intl`, either through a lookup table or next-intl custom prefixes [N2].
  - Keep `timeZone: "America/Chicago"` (as `format-date.ts` already does).
  - Use ICU plurals ("1 voluntario / 3 voluntarios").
  - Translate react-hook-form validation messages, `aria-label`s, `alt` text, page `<title>` and metadata, and Open Graph `locale`.
- **Right-to-left:** not needed for Spanish, Vietnamese or Chinese. Use Tailwind's logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) in new components so Arabic stays possible later.
- **WCAG 2.2 AA**
  - 3.1.1 Language of Page: set `lang` on `<html>` for each locale.
  - 3.1.2 Language of Parts: put `lang` on the switcher labels and on any embedded English text in Spanish pages.
  - 3.2.3, 3.2.4 and 3.2.6: keep navigation, labels and help placement consistent within each language [U4].
  - Payment iframes (Stripe, PayPal) and DocuSign must also be set to the page's language. Otherwise the most important step of the flow is a different language from the page around it.

---

## Open questions and things to verify

1. **Funding:** does TSOH receive federal money, or distribute TEFAP/USDA food through a food bank such as North Texas Food Bank? This determines which language-access rules apply (§7, counsel).
2. **Waiver language:** with counsel, decide which language controls and whether to use a bilingual or separate document, and how minors sign. Choose a professional translator.
3. **Sanity non-profit plan:** is it granted, and does it include AI Assist? Until then, Agent Actions (experimental) is the free option [C9][C10].
4. **PayPal:** does the Spanish locale render with `es_US` (JS SDK table) or `es_XC` (REST table)? Test in sandbox [V5][V6].
5. **Eventbrite:** confirm the event `locale` field and accepted values (`GET /v3/events/{id}/`), and whether checkout follows the event's language [V10][V11].
6. **DocuSign:** run `listSupportedLanguages` on TSOH's account to choose between `es` and `es_MX`, and confirm the plan includes per-recipient language [V8][V9].
7. **Chinese script:** Simplified or Traditional. Check with Plano and Collin community partners.
8. **Program copy (~1,200 lines of TSX):** move it into Sanity (document-level, so staff own the translations) or into message JSON (developer-owned)?
9. **ACS detail for Plano:** B16001 for Plano was not available from Census Reporter. The Census API now requires a key (observed while researching). Pull it from data.census.gov if you need the city-level detail.
10. **Vendor pricing:** DeepL free-tier terms and Crowdin, Lokalise and Tolgee nonprofit terms all changed recently. Confirm directly before choosing.

---

## Sources

**Census and demographics**
- [S1] ACS 2020–2024 5-year, C16001 (via Census Reporter API): https://api.censusreporter.org/1.0/data/show/acs2024_5yr?table_ids=C16001&geo_ids=16000US4858016,05000US48085,05000US48113,05000US48121,05000US48439
- [S2] ACS 2024 1-year, B16001 (via Census Reporter API): https://api.censusreporter.org/1.0/data/show/latest?table_ids=B16001&geo_ids=05000US48085 (and `05000US48113`, `05000US48121`, `05000US48439`)
- [S4] HHS LEP guidance fact sheet (5% / 1,000 safe harbor): https://www.hhs.gov/civil-rights/for-individuals/special-topics/limited-english-proficiency/fact-sheet-guidance/index.html

**Next.js and next-intl**
- [N1] https://next-intl.dev/docs/routing/setup
- [N2] https://next-intl.dev/docs/routing/configuration
- [N3] https://registry.npmjs.org/next-intl/latest
- [N4] https://next-intl.dev/blog/nextjs-root-params
- [N5] https://nextjs.org/docs/app/guides/internationalization
- [N6] https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- [N7] https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- [N8] https://npmjs.com/package/@inlang/paraglide-next
- [N9] https://lingui.dev/tutorials/react-rsc (seen via search results; not opened)

**Sanity**
- [C1] https://www.sanity.io/docs/studio/localization
- [C2] https://github.com/sanity-io/plugins/tree/main/plugins/sanity-plugin-internationalized-array
- [C3] https://www.sanity.io/docs/changelog/b5da7bbe-6b53-4d35-8c0b-f031764e12fa
- [C4] https://cdn.jsdelivr.net/npm/@sanity/document-internationalization@6.2.26/README.md
- [C5] https://registry.npmjs.org/@sanity/document-internationalization/latest · https://registry.npmjs.org/sanity-plugin-internationalized-array/latest · https://registry.npmjs.org/@sanity/assist/latest
- [C6] https://www.sanity.io/docs/studio/ai-assist-content-translation
- [C7] https://www.sanity.io/docs/agent-actions/translate-quickstart
- [C8] https://www.sanity.io/docs/platform-management/how-ai-credits-work
- [C9] https://www.sanity.io/pricing
- [C10] https://www.sanity.io/docs/platform-management/non-profit-plan

**Google Search Central**
- [G1] https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- [G2] https://developers.google.com/search/docs/specialty/international/localized-versions
- [G3] https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages
- [G4] https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

**UX and accessibility**
- [U1] https://www.w3.org/International/questions/qa-link-lang.en.html
- [U2] https://designsystem.digital.gov/components/language-selector/
- [U3] https://www.w3.org/International/articles/article-text-size
- [U4] https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html · https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html · https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html

**Vendors**
- [V1] https://docs.stripe.com/js/appendix/supported_locales
- [V2] https://docs.stripe.com/api/checkout/sessions/create
- [V3] https://docs.stripe.com/receipts
- [V4] https://docs.stripe.com/invoicing/customer
- [V5] https://developer.paypal.com/sdk/js/configuration/
- [V6] https://developer.paypal.com/reference/locale-codes/
- [V7] https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/enveloperecipients/
- [V8] https://www.docusign.com/blog/developers/common-api-tasks-change-the-display-language-embedded-signing
- [V9] https://www.docusign.com/blog/developers/the-trenches-recipient-email-languages
- [V10] https://www.eventbrite.com/help/en-us/articles/364490/how-to-change-the-language-settings-for-your-event/ (redirects to support.eventbrite.com, which returned 403; content seen via search results)
- [V11] https://www.eventbrite.com/platform/api (Text Overrides `locale`)
- [V12] https://supabase.com/docs/guides/auth/auth-email-templates
- [V13] https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
- [V14] https://react.email/docs/guides/internationalization/next-intl

**Translation tools**
- [T2] https://docs.lokalise.com/en/articles/1400453-free-plan · https://docs.lokalise.com/en/articles/5159153-available-plans-and-payment-methods
- [T3] https://tolgee.io/pricing/self-hosted
- [T4] https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-plans
- [T5] https://cloud.google.com/products/translate/pricing

**Legal and compliance**
- [L1] https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contributions-written-acknowledgments
- [L2] https://www.justice.gov/opa/pr/justice-department-releases-guidance-implementing-president-trumps-executive-order
- [L3] https://public-inspection.federalregister.gov/2025-06366.pdf (EO 14224)
- [L4] https://www.usda.gov/sites/default/files/guidance-documents/fns.crd-01-2026-modifyingFNSinstruction113-1.pdf (returned 403; contents seen via search results)
- [L5] https://www.hhs.gov/sites/default/files/ocr-dcl-section-1557-language-access.pdf
- [L6] https://trerc.tamu.edu/article/liability-waivers-enforceable
