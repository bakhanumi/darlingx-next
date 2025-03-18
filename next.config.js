/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Если нужна поддержка old .htaccess файла, то стоит использовать пакет "next-htaccess"
  // Иначе для продакшна Next.js рекомендуется делать redirects через этот файл конфигурации
  async rewrites() {
    return [
      {
        source: '/books',
        destination: '/books',
      },
      {
        source: '/book-details',
        destination: '/book/[id]',
      },
      {
        source: '/posts',
        destination: '/posts',
      },
      {
        source: '/projects',
        destination: '/projects',
      },
      {
        source: '/lists',
        destination: '/lists',
      },
      {
        source: '/cv',
        destination: '/cv',
      },
    ];
  },
};

module.exports = nextConfig;
