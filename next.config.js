module.exports = {
  basePath: process.env.NEXT_CONFIG_BASE_PATH || undefined,
  i18n: {
    locales: ['en', 'es', 'ja', 'zh', 'zh-TW'],
    defaultLocale: 'en',
  },
  future: {
    webpack5: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://app.swingby.network/migrate',
        permanent: true,
      },
    ]
  },
};
