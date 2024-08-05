import "server-only";

import { PropsWithChildren } from "react";
import { getDateString, getTimeString } from "@/utils/dates";
import FullLogoIcon from "../icons/FullLogoIcon";

type Props = {
	title: string;
};

export default function PDFPage({ title, children }: PropsWithChildren<Props>) {
	const now = new Date();

	return (
		<html dir="rtl">
			<body>
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
