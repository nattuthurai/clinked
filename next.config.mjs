/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        TOKEN : process.env.TOKEN,
        TENANT_ID : process.env.TENANT_ID,
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        SITE_ID: process.env.SITE_ID,
        LIST_ID: process.env.LIST_ID,
        LIST_CLIENTMAPPING_ID: process.env.LIST_CLIENTMAPPING_ID,
        INTEGRATION_KEY: process.env.INTEGRATION_KEY,
        CCH_PASSWORD: process.env.CCH_PASSWORD,
        CCH_CLIENTS_ID: process.env.CCH_CLIENTS_ID,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID,
        SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET,
        SALESFORCE_USERNAME: process.env.SALESFORCE_USERNAME,
        SALESFORCE_PASSWORD: process.env.SALESFORCE_PASSWORD,
    },
    reactStrictMode: false,
};

export default nextConfig;
