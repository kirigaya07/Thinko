# Thinko – Notion Clone

Thinko is a full-featured Notion clone built with Next.js, Convex, Clerk, and EdgeStore. It provides real-time collaborative editing and a modern, responsive experience.

## Features

- Real-time collaborative editing
- Secure user authentication via Clerk
- File uploads using EdgeStore
- Rich text editing powered by BlockNote
- Light and dark mode themes
- Fully responsive design

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Backend:** Convex (real-time database)
- **Authentication:** Clerk
- **File Storage:** EdgeStore
- **Styling:** Tailwind CSS
- **Rich Text Editor:** BlockNote
- **State Management:** Zustand

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Accounts for Convex, Clerk, and EdgeStore

### Installation

1. **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd notion-clone
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    ```bash
    cp env.example .env.local
    ```
    Edit `.env.local` and configure your environment variables.

4. **Run the development server:**
    ```bash
    npm run dev
    ```

## Deploying to Vercel

### 1. Prepare the Project

Make sure your app builds locally:
```bash
npm run build
```

### 2. Deploy

#### Option A: Vercel CLI

1. Install the CLI:
    ```bash
    npm i -g vercel
    ```
2. Deploy:
    ```bash
    vercel
    ```

#### Option B: Vercel Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Sign in at [vercel.com](https://vercel.com).
3. Click "New Project" and import your repository.
4. Configure environment variables (see below).
5. Deploy.

### 3. Environment Variables

Add these variables in your Vercel project dashboard:

**Required:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` – Clerk publishable key
- `CLERK_SECRET_KEY` – Clerk secret key
- `NEXT_PUBLIC_CONVEX_URL` – Convex deployment URL
- `EDGE_STORE_ACCESS_KEY` – EdgeStore access key
- `EDGE_STORE_SECRET_KEY` – EdgeStore secret key

**Optional:**
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` – Custom sign-in URL (default: `/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` – Custom sign-up URL (default: `/sign-up`)
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` – Redirect after sign-in (default: `/`)
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` – Redirect after sign-up (default: `/`)

### 4. Clerk Configuration

- Add your Vercel domain to allowed origins in the Clerk dashboard.
- Update Clerk configuration in `convex/auth.config.js` for production.

### 5. Convex Configuration

- Deploy Convex functions:
    ```bash
    npx convex dev --once
    ```
- Update `NEXT_PUBLIC_CONVEX_URL` in Vercel with your production Convex URL.

### 6. EdgeStore Configuration

- Add your Vercel domain to allowed origins in EdgeStore.
- Ensure your EdgeStore keys are set in Vercel.

## Post-Deployment Checklist

- Authentication works correctly
- File uploads function properly
- Real-time collaboration is functional
- All routes are accessible

## Troubleshooting

### Build Errors

- Make sure all dependencies are listed in `package.json`
- Confirm all environment variables are set
- Ensure TypeScript compiles without errors

### Runtime Errors

- Check Vercel function logs
- Verify environment variable configuration
- Confirm access to Clerk, Convex, and EdgeStore

### Performance Issues

- Review Vercel analytics and function execution times
- Consider upgrading to Vercel Pro for enhanced performance

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [EdgeStore Documentation](https://edgestore.dev/docs)

## License

This project is licensed under the MIT License.
