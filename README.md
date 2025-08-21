# Notion Clone

A full-featured Notion clone built with Next.js, Convex, Clerk, and EdgeStore.

## Features

- Real-time collaborative editing
- User authentication with Clerk
- File uploads with EdgeStore
- Rich text editing with BlockNote
- Dark/light theme support
- Responsive design

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Convex (real-time database)
- **Authentication**: Clerk
- **File Storage**: EdgeStore
- **Styling**: Tailwind CSS
- **Rich Text Editor**: BlockNote
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Convex account
- Clerk account
- EdgeStore account

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd notion-clone
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`

5. Run the development server:

```bash
npm run dev
```

## Deployment to Vercel

### 1. Prepare Your Project

Ensure your project builds successfully locally:

```bash
npm run build
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

#### Option B: Using Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your repository
5. Configure environment variables (see below)
6. Deploy

### 3. Environment Variables Setup

In your Vercel project dashboard, add these environment variables:

#### Required Variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `EDGE_STORE_ACCESS_KEY` - Your EdgeStore access key
- `EDGE_STORE_SECRET_KEY` - Your EdgeStore secret key

#### Optional Variables:

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Custom sign-in URL (default: `/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Custom sign-up URL (default: `/sign-up`)
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Redirect after sign-in (default: `/`)
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Redirect after sign-up (default: `/`)

### 4. Update Clerk Configuration

1. Go to your Clerk dashboard
2. Add your Vercel domain to allowed origins
3. Update the auth configuration in `convex/auth.config.js` with your production domain

### 5. Update Convex Configuration

1. Deploy your Convex functions:

```bash
npx convex dev --once
```

2. Update `NEXT_PUBLIC_CONVEX_URL` in Vercel with your production Convex URL

### 6. Update EdgeStore Configuration

1. Go to your EdgeStore dashboard
2. Add your Vercel domain to allowed origins
3. Ensure your EdgeStore keys are correctly set in Vercel

## Post-Deployment

After deployment, verify:

- Authentication works correctly
- File uploads function properly
- Real-time collaboration is working
- All routes are accessible

## Troubleshooting

### Build Errors

- Ensure all dependencies are in `package.json`
- Check that all environment variables are set
- Verify TypeScript compilation passes locally

### Runtime Errors

- Check Vercel function logs
- Verify environment variables are correctly set
- Ensure external services (Clerk, Convex, EdgeStore) are accessible

### Performance Issues

- Check Vercel analytics
- Monitor function execution times
- Consider upgrading to Vercel Pro for better performance

## Support

For issues related to:

- **Vercel**: Check [Vercel documentation](https://vercel.com/docs)
- **Next.js**: Check [Next.js documentation](https://nextjs.org/docs)
- **Convex**: Check [Convex documentation](https://docs.convex.dev)
- **Clerk**: Check [Clerk documentation](https://clerk.com/docs)
- **EdgeStore**: Check [EdgeStore documentation](https://edgestore.dev/docs)

## License

This project is licensed under the MIT License.
