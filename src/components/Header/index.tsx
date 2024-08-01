"use client";

import Image from "next/image";
import styles from "./header.module.scss";
import { LinkInfo } from "@/utils/types";
import ToggleLinks from "../ToggleLinks";

const NAV_LINKS: readonly LinkInfo[] = Object.freeze([
	{ name: "ביקורים עתידיים", href: "/" },
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
				<ToggleLinks variant="filled" links={NAV_LINKS} />
			</nav>
		</header>
	);
}
