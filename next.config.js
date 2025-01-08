import nextIntl from 'next-intl/plugin';

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');
const withNextIntl = nextIntl('./src/i18n.ts');

/** @type {import("next").NextConfig} */
const config = {
  webpack(config) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  output: 'standalone',
  async rewrites() {
    console.log('Storage configuration:', {
      host: process.env.STORAGE_HOST,
      port: process.env.STORAGE_PORT,
      fullUrl: `http://${process.env.STORAGE_HOST}:${process.env.STORAGE_PORT}`,
    });
    return {
      beforeFiles: [
        {
          source: '/s3/:path*',
          destination: `http://${process.env.STORAGE_HOST}:${process.env.STORAGE_PORT}/:path*`,
          basePath: false,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withNextIntl(config);
