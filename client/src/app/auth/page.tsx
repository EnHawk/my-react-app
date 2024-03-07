import { redirect } from "next/navigation";

export default async function Auth() {
  redirect(`${process.env.DISCORD_AUTH_URL}`);
};