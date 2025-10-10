# AI-Solutions Server (Express + TypeScript)

## Run

- npm install
- npm run dev → http://localhost:4000

## Env

Create a `.env` file in the server directory with:

```env
# Server Configuration
PORT=4000
MONGO_URI=mongodb://localhost:27017/ai_solutions
JWT_SECRET=change_me
CLIENT_ORIGIN=http://localhost:5173

# Gemini AI Configuration (Required for AI Chat)
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Email Configuration (Optional)
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=Admin@123
```

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and add it to your `.env` file as `GEMINI_API_KEY=your_key_here`
5. Without this key, the chat will run in demo mode

## Seeds

- npm run seed:admin
- npm run seed:sample

## Key Endpoints

- Auth: /api/auth/login, /logout, /me
- Demos: /api/demos (POST public), admin list/update/delete
- Events: /api/events, /api/events/:id, /api/events/:id/register
- Reviews: /api/reviews (POST/list), admin delete
- Admin: /api/admin/stats, /api/admin/search
- Export: /api/export?type=demos|registrations
- Chat: /api/chat
