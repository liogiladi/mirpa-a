import type { Metadata } from "next";
import "./globals.scss";

import { isMobileNodeJS } from "@/utils/mobile";
import Header from "@/components/Header";

export const metadata: Metadata = {
	title: `המרפאה | משל"ט ביקורים`,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	globalThis.isMobile = await isMobileNodeJS();

	return (
		<html lang="en" data-mobile={isMobile}>
			<body>
				<Header isMobile={isMobile} />
				{children}
			</body>
		</html>
	);
}
