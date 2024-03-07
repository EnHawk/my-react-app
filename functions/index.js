/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const config = require(`./config.json`)
const admin = require(`firebase-admin`)
admin.initializeApp()

const logger = require("firebase-functions/logger");
const OpenAI = require(`openai`).default;
const openai = new OpenAI({ apiKey: config.OPENAI_SECRET_KEY });
const TwitterAPI = require(`twitter-api-v2`).default;
const twitterClient = new TwitterAPI({
  clientId: config.X_CLIENT_ID,
  clientSecret: config.X_CLIENT_SECRET
})
const dbRef = admin.firestore().doc(`Tokens/Twitter`)
const callbackURL = config.X_CALLBACK_URL;
const tweetURL = config.X_TWEET_URL;

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.api = onRequest(async (req, res) => {
 if (!req.headers.prompt) return res.send(`Hello from /api!`);

  const { prompt: content } = req.headers;
  const completion = await openai.chat.completions.create({
    messages: [{ role: `user`, content }],
    model: `gpt-3.5-turbo`
  });

  res.send(completion);
});

exports.auth = onRequest(async (req, res) => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    callbackURL,
    { scope: [`tweet.read`, `tweet.write`, `users.read`, `offline.access`] }
  );

  await dbRef.set({ codeVerifier, state });

  res.status(200).redirect(url);
})

exports.callback = onRequest(async (req, res) => {
  const { state, code } = req.query;
  const snapshot = await dbRef.get();
  const { codeVerifier, state: storedState } = snapshot.data();

  if (state !== storedState) {
    return res.status(400).send(`Stored tokens do not match!`)
  };

  const { client: loggedClient, accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: callbackURL
  });

  await dbRef.set({ accessToken, refreshToken })

  res.status(200).redirect(tweetURL)
})

exports.tweet = onRequest(async (req, res) => {
  const { refreshToken } = (await dbRef.get()).data();
  const { client: c, accessToken, refreshToken: newRefreshToken } = await twitterClient.refreshOAuth2Token(refreshToken);
  const client = c.v2;
  const { data } = client;

  await dbRef.set({ accessToken, refreshToken: newRefreshToken });

  res.sendStatus(201);

  setInterval(() => {}, 5)
})