"use client";

import { ReactNode, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./mobile-menu.module.scss";

import Link from "next/link";
import { NAV_LINKS } from "@/components/theme/Header";
import FullLogoIcon from "@/components/icons/FullLogoIcon";

export default function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const links = useMemo(
		() =>
			NAV_LINKS.reduce((acc, navLink) => {
				if (!navLink.href.includes(pathname))
					acc.push(
						<li key={navLink.href}>
							<a
								href={navLink.href}
								data-selected={navLink.href.includes(
									pathname.split("/")[1]
								)}
							>
								{navLink.name}
							</a>
						</li>
					);

				return acc;
			}, [] as ReactNode[]),
		[pathname]
	);

	return (
		<>
			<svg
				id={styles["mobile-menu"]}
				viewBox="0 0 50 50"
				xmlns="http://www.w3.org/2000/svg"
				onClick={() => setIsOpen((prev) => !prev)}
				data-open={isOpen}
			>
				<rect width="50" height="5.69" y="7.055"></rect>
				<rect width="50" height="5.69" y="22.055"></rect>
				<rect width="50" height="5.69" y="37.055"></rect>
			</svg>
			<nav id={styles["mobile-nav"]}>
				<div id={styles["nav-content"]}>
					<ul>
						{links}
						<Link href={"/"}>צד לקוח</Link>
					</ul>
					<FullLogoIcon />
				</div>
			</nav>
		</>
	);
}
