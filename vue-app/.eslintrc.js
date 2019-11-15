module.exports = {
  // parser: require.resolve('vue-eslint-parser'),
  root: true,

  env: {
    node: true,
    jest: true
  },

  plugins: ["vuetify", "kolibri"],
  extends: ["plugin:vue/recommended", "@vue/prettier"],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "object-shorthand": "warn",
    "prefer-template": "warn",
    "vue/attribute-hyphenation": [
      "error",
      "always",
      {
        ignore: ["breakpointDirective"]
      }
    ],
    "no-await-in-loop": "warn",
    "no-const-assign": "error",
    "prefer-destructuring": "warn",
    "no-eval": "error",
    "no-useless-escape": "warn",
    "prefer-spread": "warn",
    "prefer-arrow-callback": "warn",
    "no-unneeded-ternary": "warn",
    "no-else-return": "warn",
    "no-multi-assign": "warn",
    "no-undef": "warn",

    "vuetify/no-deprecated-classes": "error",
    "vuetify/grid-unknown-attributes": "error",
    "vuetify/no-legacy-grid": "error",

    "kolibri/vue-filename-and-component-name-match": "warn",
    //'kolibri/vue-component-registration-casing': 'warn',
    "kolibri/vue-no-unused-properties": "warn",
    "kolibri/vue-no-unused-vuex-properties": "warn",
    "kolibri/vue-no-unused-methods": "warn",
    "kolibri/vue-no-unused-vuex-methods": "warn",
    "kolibri/vue-watch-no-string": "warn",
    "kolibri/vue-no-unused-translations": "warn",
    "kolibri/vue-no-undefined-string-uses": "warn"
  },

  parserOptions: {
    parser: "babel-eslint"
  },

  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true
      }
    },
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true
      }
    },
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true
      }
    }
  ]
};
