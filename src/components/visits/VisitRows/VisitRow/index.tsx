"use client";

import { MouseEventHandler } from "react";
import styles from "./visit-row.module.css";
import { JoinedVisit } from "@/utils/dbTypes";

import InfoIcon from "@/components/icons/InfoIcon";
import RowArrow from "@/components/icons/RowArrow";
import { VisitType } from "..";
import VisitMainInfo from "../../VisitInfoDialog/VisitMainInfo";

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
