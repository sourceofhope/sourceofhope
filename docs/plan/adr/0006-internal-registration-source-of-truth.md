# ADR-0006: Our system owns every TSOH event registration; Eventbrite is an intake door; partner events link out

- **Status:** Accepted (Eventbrite pattern pending spike 0.9)
- **Date:** 2026-11-21

## Context

Today volunteers register on Eventbrite, download PDFs and email signed agreements. The project lead wants our own system to be the source of truth for **every** TSOH event, with external sites only linking to our sign-up. Events run by partners should still appear on our site, but we do not own their sign-up.

Eventbrite's "External Ticketing", which sends buyers to another site, is [no longer available to new organizers](https://www.eventbrite.com/help/en-us/articles/712079/how-to-create-an-externally-ticketed-event-on-eventbrite-music/). A custom event link [can't redirect elsewhere](https://www.eventbrite.com/help/en-us/articles/560293/how-to-customize-your-event-url-web-address/). So an Eventbrite listing cannot simply hand off to our sign-up.

## Decision

- **TSOH events:** the Hub's Volunteer flow is the only registration system, and our database holds the only roster.
- **Eventbrite as an intake door:**
  - Each listing has one free RSVP ticket, and its description links to our sign-up.
  - RSVPs are imported automatically as *incomplete* sign-ups, and each person is emailed to finish on our site (party details and agreement).
  - Ticket quantity is synced to our remaining capacity.
  - Details are in [02 §5.6](../02_SYSTEM_DESIGN.md#56-eventbrite-intake).
- **Facebook:** a manual post packet from the portal, linking to our sign-up with UTMs.
- **Google:** schema.org `Event` data on our event pages, for Google's event results.
- **Partner events:** listed on our site (Events, Get Help, Volunteer) with a partner badge and "Sign up on {partner} ↗". Never registered internally, never pushed to external platforms.

## Consequences

- One roster, one agreement status and one set of reminders, wherever people found the event.
- Eventbrite RSVPs who never finish are removed at cutoff like anyone else; we never cancel their Eventbrite order automatically.
- **Fallback, if spike 0.9 or Eventbrite support says the intake pattern is not acceptable:** stop publishing to Eventbrite. Rely on Google event results, Facebook, partner calendars and our own links and QR codes.

## Spike result (0.9)

*To be filled in, including Eventbrite support's answer.*
