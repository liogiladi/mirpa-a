"use client";

import { memo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./header.module.scss";

import { getDateString } from "@/utils/dates";
import { SEARCH_QUERIES } from "@/utils/searchQueries";

import ToggleLinks, { ToggleLinkInfo } from "../ToggleLinks";
import MobileMenu from "../../general/MobileMenu";

export const NAV_LINKS = Object.freeze([
	{
		name: "ביקורים עתידיים",
		href: `/upcoming-visits?${
			SEARCH_QUERIES.dateFilter.name
		}=${getDateString(new Date())}`,
	},
	{ name: "בקשות ביקור", href: "/requested-visits?status=pending" },
	{ name: "ניהול מטופלים", href: "/patients-management" },
	{ name: "אודות", href: "/about" },
]) satisfies readonly ToggleLinkInfo[];

type Props = {
	isMobile: boolean;
};

export default memo(function Header({ isMobile }: Props) {
	const pathname = usePathname();

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
				{isMobile ? (
					<h1>
						{
							NAV_LINKS.find(
								(navLink) =>
									navLink.href.includes(pathname) ||
									pathname.startsWith(navLink.href)
							)?.name
						}
					</h1>
				) : (
					<span>משלט ביקורים</span>
				)}
			</div>
			{isMobile ? (
				<MobileMenu />
			) : (
				<nav>
					<ToggleLinks variant="filled" links={NAV_LINKS} />
				</nav>
			)}
		</header>
	);
});
