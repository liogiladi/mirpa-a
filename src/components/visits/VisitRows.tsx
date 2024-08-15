"use client";

import { ReactNode, useCallback, useMemo, useState } from "react";
import styles from "./visit-rows.module.scss";
import { JoinedVisit } from "@/utils/dbTypes";
import { isMobileCross } from "@/utils/mobile";
import { getDateString, getTimeString } from "@/utils/dates";
import { TupleOfLength } from "@/utils/types";

import VisitRow from "./VisitRow";
import VisitInfoDialog from "./VisitInfoDialog";
import Table from "../Table";
import InfoIcon from "../icons/InfoIcon";

export type VisitType = "upcoming" | "requested";

type Props = {
	type: VisitType;
	visits: NonNullable<JoinedVisit>[];
};

export default function VisitRows({ type, visits }: Props) {
	const [selectedVisitInfo, setSelectedVisitInfo] =
		useState<JoinedVisit | null>(null);

	const openInfoModal = useCallback(
		(index: number) => {
			setSelectedVisitInfo(visits[index]);
		},
		[visits]
	);

	const isMobile = isMobileCross();

	const rows: TupleOfLength<ReactNode, 5>[] | ReactNode[] = useMemo(
		() =>
			visits.map((visit, index) => {
				if (isMobile) {
					const date = new Date(visit.datetime);

					return [
						`${visit.visitor.first_name} ${visit.visitor.last_name}`,
						`${visit.patient.first_name} ${visit.patient.last_name}`,
						getDateString(date, { format: true }),
						getTimeString(date),
						<InfoIcon
							key={visit.id}
							onClick={() => openInfoModal(index)}
						/>,
					] as TupleOfLength<ReactNode, 5>;
				} else {
					return (
						<VisitRow
							key={visit.id}
							data={visit}
							onClick={() => openInfoModal(index)}
						/>
					);
				}
			}),
		[isMobile, openInfoModal, visits]
	);

	if (rows.length === 0)
		return <span id={styles.empty}>אין ביקורים לתאריך זה</span>;

	return (
		<>
			{isMobile ? (
				<Table
					className={styles["visits-table"]}
					width={5}
					columns={["שם המבקר", "שם מטופל", "תאריך", "שעה", "מידע"]}
					rows={rows as TupleOfLength<ReactNode, 5>[]}
				/>
			) : (
				<section id={styles["visit-rows"]}>{rows}</section>
			)}
			<VisitInfoDialog
				type={type}
				visitInfo={selectedVisitInfo}
				onClose={() => setSelectedVisitInfo(null)}
			/>
		</>
	);
}
