# Webhook Receiver

A secure webhook receiver service built with Netlify Functions and Supabase, featuring API key authentication, source validation, rate limiting, and comprehensive logging.

## Features

- 🔒 Secure webhook endpoint with API key authentication
- 🛡️ Source validation for trusted origins
- 🚦 Rate limiting protection
- 📝 Comprehensive logging system
- 🗄️ Supabase database integration
- ⚡ Serverless deployment via Netlify Functions

## Tech Stack

- **Runtime**: Netlify Functions (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Validation**: Joi
- **Security**: API key authentication, origin validation
- **Logging**: Custom logging with database persistence

## Prerequisites

- Node.js 18 or higher
- Netlify CLI (`npm install -g netlify-cli`)
- Supabase account
- GitHub account

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   API_KEY=your-secure-api-key-here
   ALLOWED_SOURCES=https://trusted-source.com,https://another-trusted.com
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Start the development server:
   ```bash
   netlify dev
   ```

## Deployment

### 1. Supabase Setup

1. Create a new Supabase project
2. The database schema will be automatically created using the migration files in `supabase/migrations/`
3. Save your Supabase URL and anon key for the next steps

### 2. Netlify Setup

1. Push your code to GitHub
2. Log in to Netlify and create a new site from Git
3. Connect your repository
4. Configure build settings:
   - Build command: `npm run build` (if applicable)
   - Publish directory: `dist` (if applicable)
5. Add environment variables in Netlify dashboard:
   - `API_KEY`: Your secure API key
   - `ALLOWED_SOURCES`: Comma-separated list of allowed origins
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Deploy the site

Your webhook endpoint will be available at: `https://your-site.netlify.app/api/webhook`

## Usage

### Sending Webhooks

Send POST requests to your webhook endpoint with:

1. Required headers:
   ```
   X-API-Key: your-api-key
   Content-Type: application/json
   ```

2. Payload format:
   ```json
   {
     "activity": "user.created",
     "datestamp": "2024-01-01T12:00:00Z",
     "customer": "customer123",
     "source": "https://trusted-source.com"
   }
   ```

### Response Codes

- `201`: Webhook processed successfully
- `400`: Invalid payload
- `401`: Invalid API key
- `403`: Unauthorized source
- `405`: Method not allowed
- `500`: Internal server error

## Security Considerations

- Keep your API key secure and rotate it periodically
- Regularly review the allowed sources list
- Monitor the logs for suspicious activity
- Consider implementing additional security measures like payload signing

## Rate Limiting

The service implements rate limiting to prevent abuse:
- 100 requests per IP address per 15 minutes
- Configurable through environment variables

## Monitoring

All webhook activities and system events are logged to:
1. Console (during development)
2. Supabase database (tables: `webhooks` and `logs`)

## License

MIT