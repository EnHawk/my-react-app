import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const code = query.get(`code`);
  const cookie = cookies();

  if (!code) {
    return new Response(`No Code?`, { status: 400 });
  };

  const token = await axios.post(
    `https://discord.com/api/v10/oauth2/token`,
    {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: `authorization_code`,
      code,
      redirect_uri: `${process.env.APP_URL}/auth/callback`
    },
    {
      headers: {
        "Content-Type": `application/x-www-form-urlencoded`
      }
    }
  );
  const { access_token, expires_in, refresh_token } = token.data;
  cookie.set(`access_token`, access_token);
  cookie.set(`expires_in`, expires_in);
  cookie.set(`refresh_token`, refresh_token);

  return redirect(process.env.APP_URL);
}