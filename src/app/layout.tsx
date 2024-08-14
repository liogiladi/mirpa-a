import type { Metadata } from "next";
import "./globals.scss";

import { headers } from "next/headers";
import uap from "ua-parser-js";

import Header from "@/components/Header";

export const metadata: Metadata = {
	title: `המרפאה | משל"ט ביקורים`,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { os, device } = uap(headers().get("user-agent")!);

	globalThis.isMobile =
		["mobile", "tablet"].includes(device.type || "") ||
		["Android", "iOS", "WebOS"].includes(os.name || "");

	return (
		<html lang="en" data-mobile={isMobile}>
			<body>
				<Header isMobile={isMobile} />
				{children}
			</body>
		</html>
	);
}
