import { Suspense } from "react";
import Image from "next/image";
import styles from "./header.module.scss";

import { getDateString } from "@/utils/dates";
import { SEARCH_QUERIES } from "@/utils/searchQueries";

import ToggleLinks, { ToggleLinkInfo } from "../ToggleLinks";

const NAV_LINKS: readonly ToggleLinkInfo[] = Object.freeze([
	{
		name: "ביקורים עתידיים",
		href: `/upcoming-visits?${
			SEARCH_QUERIES.dateFilter.name
		}=${getDateString(new Date())}`,
	},
	{ name: "בקשות ביקור", href: "/requests" },
	{ name: "ניהול מטופלים", href: "/patients-management" },
	{ name: "דיווחי תקלות", href: "/error-reports" },
	{ name: "אודות", href: "/about" },
]);

export const dynamic = globalThis.isMobile ? "force-dynamic" : "auto";

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
				{globalThis.isMobile ? (
					<h1>{globalThis.currentPageName}</h1>
				) : (
					<span>משלט ביקורים</span>
				)}
			</div>
			{!globalThis.isMobile && (
				<nav>
					<Suspense>
						<ToggleLinks variant="filled" links={NAV_LINKS} />
					</Suspense>
				</nav>
			)}
		</header>
	);
}
