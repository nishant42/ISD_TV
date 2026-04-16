// middleware.ts
export default function middleware(req) {
  const authHeader = req.headers.get('authorization');

  if (authHeader) {
    // Decode the credentials from the browser popup
    const authValue = authHeader.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Compare with the SITE_USER and SITE_PASS you set in Vercel
    if (user === process.env.SITE_USER && pwd === process.env.SITE_PASS) {
      return; // Continue to the requested page
    }
  }

  // If wrong or missing, tell the browser to show the login popup
  return new Response('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

// This tells Vercel to run this check on every single page
export const config = {
  matcher: ['/(.*)'],
};
