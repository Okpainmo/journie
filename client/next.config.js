/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  images: {
    domains: ['journie-users-profile-image-bucket.s3.eu-north-1.amazonaws.com'],
  },
};
