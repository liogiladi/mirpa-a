import type { Metadata } from "next";
import "@/styles/globals.scss";
import "@/styles/pdf-document.scss";

import { isMobileNodeJS } from "@/utils/mobile";

import { DetectMobileContextProvider } from "@/contexts/detectMobile";

import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/theme/Header";

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
				<NextTopLoader
					color="white"
					showSpinner={!globalThis.isMobile}
				/>
				<DetectMobileContextProvider>
					<Header isMobile={globalThis.isMobile} />
					{globalThis.isMobile ? (
						children
					) : (
						<div id="main-wrapper">{children}</div>
					)}
				</DetectMobileContextProvider>
				<Toaster />
			</body>
		</html>
	);
}
