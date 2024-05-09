// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    auth: {
      secret: process.env.AUTH_SECRET,
      origin: process.env.AUTH_ORIGIN
    }
  },

  modules: ['@nuxt/ui', 'nuxt-mongoose', 'nuxt-server-utils', '@sidebase/nuxt-auth'],

  ui: {},

  mongoose: {
    uri: process.env.MONGODB_URI,
    modelsDir: 'server/models'
  },

  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs"
    }
  }
})
