require('dotenv').config()

const nextConfig = {
	trailingSlash: true,
	reactStrictMode: true,
	experimental: {
		outputStandalone: true,
	  },
}

module.exports = nextConfig
