/* Title doesn't work otherwise */
/* eslint-disable @next/next/no-head-element */
import "server-only";

import { CSSProperties, PropsWithChildren } from "react";
import { getDateString, getTimeString } from "@/utils/dates";
import FullLogoIcon from "@/components/icons/FullLogoIcon";

type Props = {
	title: string;
	bodyStyle?: CSSProperties;
};

export default function PDFPage({
	title,
	children,
	bodyStyle,
}: PropsWithChildren<Props>) {
	const now = new Date();

	return (
		<html dir="rtl">
			<head>
				<title>{`המרפאה | ${title}`}</title>
			</head>
			<body style={bodyStyle}>
				<header>
					<div>
						<h1>{title}</h1>
						<div id="date-time">{`${getDateString(now, {
							format: true,
						})} ${getTimeString(now)}`}</div>
						<FullLogoIcon id="logo" />
					</div>
				</header>
				<main>{children}</main>
			</body>
		</html>
	);
}
