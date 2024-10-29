import { NextRequest, NextResponse } from 'next/server';
import axiosInstance from '@/lib/axiosInstance';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  const cookieState = req.cookies.get('google_oauth_state')?.value
  const cookieVerifier = req.cookies.get('google_oauth_code_verifier')?.value

  if (!code || !state) {
    // console.error('Missing OAuth parameters');
    return NextResponse.json({ error: 'Missing OAuth parameters' }, { status: 400 });
  }

  // console.log('code', code);
  // console.log('state', state);
  // console.log('cookie state', cookieState)
  // console.log('cookie code', cookieVerifier)

  try {
    // console.log('Sending GET request to backend with Axios...');

    const { data } = await axiosInstance.get('/auth/oauth/google/callback', {
      params: {
        code,
        state,
        cookieVerifier: cookieVerifier,
        cookieState: cookieState,
      },
      withCredentials: true,
    });

    const res = NextResponse.redirect(`${req.nextUrl.origin}/`);

    res.cookies.delete('google_oauth_state')
    res.cookies.delete('google_oauth_code_verifier')

    res.cookies.set('auth_session', data.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    // console.error('Error during OAuth callback:', error);
    return NextResponse.json({ error: 'OAuth callback failed' }, { status: 500 });
  }
}
