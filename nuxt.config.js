import colors from 'vuetify/es5/util/colors'
require("./module/env")

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  server: {
    port: config.port, // default: 3000
    host: '0.0.0.0', // default: localhost,
    timing: false
  },
  head: {
    titleTemplate: '%s',
    title: '매로 ERP System',
    meta: [
      { name: "robots", content: "noindex" },
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: '주식회사 매로' },
      { hid: 'description', property: 'og:description', content: '주식회사 매로' },
      { hid: 'description', name: 'twitter:description', content: '주식회사 매로' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'og:title',
        name: 'og:title',
        content: '매로 ERP System'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: '매로 ERP System'
      },
      {
        name: 'og:type',
        content: 'website'
      },
      {
        name: 'og:site_name',
        content: '매로 ERP System'
      },
      {
        hid: 'description',
        name: 'description',
        content: '주식회사 매로'
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: '주식회사 매로'
      },
      {
        hid: 'og:property:description',
        property: 'og:description',
        content: '주식회사 매로'
      },
      {
        hid: 'og:image',
        property: "og:image",
        content: "/img/thumb2.jpg"
      },
      {
        hid: 'og:url',
        name: 'og:url',
        content: 'https://maero.hhsoft.co.kr'
      },

    ],
    link: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Libre+Barcode+128+Text" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Lato" },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap", rel: "stylesheet" }
    ],
    script: [{
      src: "/js/ie.js"
    }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {
      src: '~/plugins/main',
      ssr: false
    },
    {
      src: '~/plugins/common',
      ssr: false
    },
    {
      src: '~/plugins/filters',
      ssr: true
    },
    {
      src: '~/plugins/axios',
      mode: "client"
    },

  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',

    '@nuxtjs/style-resources',
    'vue-scrollto/nuxt',
  ],
  styleResources: {
    less: [
      "~/assets/const.less"
    ]
  },
  serverMiddleware: [
    // <project root>/api/index.js 모듈을 미들웨어로 추가
    '~/api/index.js',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: config.host + "/api/v1/",
    browserBaseURL: "/api/v1/"
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#ffa600",
          accent: "#ffa600",
          secondary: "#ffa600",
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
