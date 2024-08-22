import type { Metadata } from "next";
import "@/styles/globals.scss";

import { isMobileNodeJS } from "@/utils/mobile";

import { DetectMobileContextProvider } from "@/contexts/detectMobile";
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
				<DetectMobileContextProvider>
					<Header isMobile={isMobile} />
					{children}
				</DetectMobileContextProvider>
			</body>
		</html>
	);
}
