# POOJA
1

## AI quote generation

The quote studio uses Gemini on the server. To enable generated quotes locally:

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` to your key.
3. Restart the Next.js development server.

Keep `.env.local` private and never commit your API key. Without a key, the quote studio uses its curated local messages.
