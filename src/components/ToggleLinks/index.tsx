"use client";

import { MouseEventHandler, useMemo } from "react";
import Link from "next/link";
import { LinkInfo } from "@/utils/types";
import styles from "./toggle-links.module.scss";
import { usePathname } from "next/navigation";

type Props = {
	variant: "filled" | "outline";
	links: readonly LinkInfo[];
	customOnClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function ToggleLinks({ variant, links, customOnClick }: Props) {
	const pathname = usePathname();

	const linkElements = useMemo(
		() =>
			links.map((link, index) => {
				return (
					<li key={index} data-active={link.href === pathname}>
						<Link onClick={customOnClick} href={link.href}>
							{link.name}
						</Link>
					</li>
				);
			}),
		[customOnClick, links, pathname]
	);

	return (
		<ul className={`${styles["toggle-links"]} ${styles[variant]}`}>
			{linkElements}
		</ul>
	);
}
