"use client";

import { HTMLProps, MouseEventHandler, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import styles from "./toggle-links.module.scss";
import { SEARCH_QUERIES } from "@/utils/searchQueries";

export type ToggleLinkInfo = { name: string; extraActiveMatches?: string[] } & (
	| { href: string }
	| {
			urlId: string;
			anchorExtraProps: Omit<HTMLProps<HTMLAnchorElement>, "href" | "name">;
	  }
);

type Props = {
	variant: "filled" | "outline";
	links: readonly ToggleLinkInfo[];
	id?: string;
	activeAccuracy?: "pathname" | "pathname-searchparams";
	clickCallback?: MouseEventHandler<HTMLAnchorElement>;
};

export default function ToggleLinks({
	variant,
	links,
	id,
	activeAccuracy = "pathname",
	clickCallback,
}: Props) {
	const pathname = usePathname();
	const params = useSearchParams();
	const paramsURL =
		activeAccuracy === "pathname-searchparams" && params.size > 0
			? `?${params.toString()}`
			: "";

	const linkElements = useMemo(
		() =>
			links.map((link, index) => {
				const defaultBehaviour = "href" in link;
				let href = defaultBehaviour ? link.href : "";

				const anchorExtraProps = defaultBehaviour
					? undefined
					: link.anchorExtraProps;

				return (
					<li
						key={index}
						data-active={
							defaultBehaviour
								? (activeAccuracy === "pathname"
										? href.split("?")[0]
										: href) === `${pathname}${paramsURL}`
								: params.get(SEARCH_QUERIES.toggleLinkActive.name) ===
								  link.urlId
						}
					>
						<Link
							href={href}
							{...anchorExtraProps}
							onClick={(e) => {
								anchorExtraProps?.onClick?.(e);
								clickCallback?.(e);
							}}
						>
							{link.name}
						</Link>
					</li>
				);
			}),
		[activeAccuracy, clickCallback, links, params, paramsURL, pathname]
	);

	return (
		<ul id={id} className={`${styles["toggle-links"]} ${styles[variant]}`}>
			{linkElements}
		</ul>
	);
}
