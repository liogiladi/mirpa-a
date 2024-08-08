"use client";

import { MouseEventHandler } from "react";
import styles from "./visit-row.module.scss";
import { JoinedVisit } from "@/utils/dbTypes";

import InfoIcon from "@/components/icons/InfoIcon";
import VisitMainInfo from "./VisitMainInfo";

type Props = {
	data: NonNullable<JoinedVisit>;
	onClick: MouseEventHandler<HTMLElement>;
};

export default function VisitRow({ data, onClick }: Props) {
	return (
		<article className={styles["visit-row"]} onClick={onClick}>
			<VisitMainInfo data={data} />
			<InfoIcon />
		</article>
	);
}
