declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_AUTH_URL: string
      APP_URL: string
      DISCORD_CLIENT_SECRET: string
      DISCORD_CLIENT_ID: string
    }
  }
}

export { }