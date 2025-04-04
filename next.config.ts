import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'www.abertih.com',
            port: '',
            pathname: '/GB/img/slider/**',
          },
          {
            protocol: 'https',
            hostname: 'magicalmirleft.com',
            pathname: '/wp-content/uploads/2024/03/**',
          },
          {
            protocol: 'https',
            hostname: 'i0.wp.com',
            pathname: '/www.nidaigle.com/wp-content/uploads/2020/06/**',
          },
        ],
      },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);