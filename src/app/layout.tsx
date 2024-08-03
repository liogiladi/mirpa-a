import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import "./globals.scss";

export const metadata: Metadata = {
	title: "Title",
	description: "Description",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Header />
				{children}
			</body>
		</html>
	);
}
