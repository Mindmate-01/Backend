# MindMate Backend

The safety-critical backend service for the MindMate AI platform.

## Features
- **Identity Privacy**: Decoupled Identity and Chat data via `pseudonymId`.
- **Crisis Detection**: "Circuit Breaker" mechanism to lock sessions on high-risk keywords.
- **Mental Health Chat**: Session management and message storage (AI stubbed).
- **Mood Tracking**: Wellness dashboard API.

## API Documentation
See the full documentation in `backend_documentation.md` (Artifacts).

## Setup
1.  `npm install`
2.  Create `.env` with `MONGO_URI` and `JWT_SECRET`.
3.  `npm run dev`
