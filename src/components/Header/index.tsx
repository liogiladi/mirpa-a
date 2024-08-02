"use client";

import Image from "next/image";
import styles from "./header.module.scss";
import ToggleLinks, { ToggleLinkInfo } from "../ToggleLinks";
import { getDateString } from "@/utils/dates";
import { Suspense } from "react";

const NAV_LINKS: readonly ToggleLinkInfo[] = Object.freeze([
	{
		name: "ביקורים עתידיים",
		href: `/upcoming-visits?date=${getDateString(new Date())}`,
	},
	{ name: "בקשות ביקור", href: "/requests" },
	{ name: "ניהול מטופלים", href: "/patients-management" },
	{ name: "דיווחי תקלות", href: "/error-reports" },
	{ name: "אודות", href: "/about" },
]);

export default function Header() {
	return (
		<header id={styles.header}>
			<div id={styles.brand}>
				<Image
					src="/logo.svg"
					alt="site logo"
					width={109}
					height={107}
					quality={1}
				/>
				<span>משלט ביקורים</span>
			</div>
			<nav>
				<Suspense>
					<ToggleLinks variant="filled" links={NAV_LINKS} />
				</Suspense>
			</nav>
		</header>
	);
}
