/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "nrvivtkokikskyunzfvr.supabase.co",
				port: "",
				pathname: "**",
			},
		],
	},
};

export default nextConfig;
