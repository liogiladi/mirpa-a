import type { Metadata } from "next";
import localFont from 'next/font/local'
import Header from "@/components/Header";
import "./globals.css";

const heebo = localFont({ src: "../../public/fonts/Heebo-VariableFont_wght.ttf"});

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
			<body className={heebo.className}>
				<Header />
				{children}
			</body>
		</html>
	);
}
