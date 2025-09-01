/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for pino-pretty
    if (isServer) {
      config.externals.push('pino-pretty');
    }
    
    // Fix Watchpack errors by ignoring system files
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/pagefile.sys',
        '**/hiberfil.sys',
        '**/swapfile.sys',
        'C:/pagefile.sys',
        'C:/hiberfil.sys',
        'C:/swapfile.sys',
      ],
    };
    
    // Fix bigint issues with expo/react-native dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    // Ignore expo and react-native modules that cause bigint issues
    config.externals = [
      ...config.externals,
      {
        'react-native': 'react-native',
        'expo': 'expo',
        '@expo/env': '@expo/env',
      },
    ];
    
    return config;
  },
}

export default nextConfig;
