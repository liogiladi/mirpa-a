"use client";

import { MouseEventHandler } from "react";
import styles from "./visit-row.module.scss";
import { JoinedVisit } from "@/utils/dbTypes";

import InfoIcon from "@/components/icons/InfoIcon";
import VisitMainInfo from "./VisitMainInfo";
import { VisitType } from "./VisitRows";
import RowArrow from "../icons/RowArrow";

type Props = {
	type: VisitType;
	data: NonNullable<JoinedVisit>;
	onClick: MouseEventHandler<HTMLElement>;
};

export default function VisitRow({ type, data, onClick }: Props) {
	return (
		<article className={styles["visit-row"]} onClick={onClick}>
			<VisitMainInfo data={data} />
			{["upcoming", "requested-rejected"].includes(type) ? (
				<InfoIcon />
			) : (
				<RowArrow />
			)}
		</article>
	);
}
