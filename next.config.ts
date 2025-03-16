import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "secure.runescape.com",
            pathname: "**",
        },
        ]
    }
};

export default nextConfig;
