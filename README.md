# Daily News Calendar

A Vercel-ready calendar of one sourced headline per day, with community event submissions and voting.

## Deploy

1. Import this repository in Vercel.
2. Create a Vercel KV database in the project Storage tab and connect it to the project.
3. Deploy. Vercel automatically provides the KV environment variables used by `api/events.js`.

The static calendar needs no build step. Community submissions and votes use the serverless API backed by Vercel KV.