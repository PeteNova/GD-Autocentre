# GD Autocentre Website

Single-file landing page for **GD Autocentre** — independent garage in Gloucester.

## Live

Deployed on Vercel (TBC).

## Stack

- Single-file HTML (`index.html`) — no build, no dependencies
- Vanilla CSS + JS

## Enquiry Form

The "Request a Quote" form uses **Web3Forms** (free tier, 250 submissions/month).

| Component | Details |
|---|---|
| **Service** | [web3forms.com](https://web3forms.com) |
| **Recipient** | info@gdautocentre.com |
| **Spam protection** | Web3Forms Botcheck (hidden checkbox honeypot) |
| **WhatsApp backup** | Auto-opens WhatsApp summary to +447894550082 |

### Access key

The form requires a Web3Forms access key (`access_key` hidden input in `index.html`).
To regenerate: go to [web3forms.com](https://web3forms.com), enter info@gdautocentre.com, confirm via email.

## Templates

5 design variants in `template-*/` folders (editorial, diagnostic, brutalist, warm, poster).

## Setup

See `SETUP_INSTRUCTIONS.txt` for non-technical setup guide.
