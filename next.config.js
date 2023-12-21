const withNextIntl = require("next-intl/plugin")();

module.exports = withNextIntl({
  // Other Next.js configuration ...
  images: {
    domains: ["images.unsplash.com"],
  },
});
