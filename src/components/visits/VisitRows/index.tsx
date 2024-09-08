"use client";

import { ReactNode, useCallback, useMemo, useState } from "react";
import styles from "./visit-rows.module.css";

import { JoinedVisit } from "@/utils/dbTypes";
import { getDateString, getTimeString } from "@/utils/dates";
import { TupleOfLength } from "@/utils/types";
import { VisitStatus } from "@/utils/searchQueries";

import { useDetectMobile } from "@/contexts/detectMobile";

import VisitRow from "./VisitRow";
import VisitInfoDialog from "../VisitInfoDialog";
import Table from "@/components/theme/Table";
import InfoIcon from "@/components/icons/InfoIcon";
import RowArrow from "@/components/icons/RowArrow";

export type VisitType = "upcoming" | "requested" | `requested-${VisitStatus}`;

type Props = {
	type: Exclude<VisitType, "requested">;
	visits: NonNullable<JoinedVisit>[];
};

export default function VisitRows({ type, visits }: Props) {
	const isMobile = useDetectMobile();
	const [selectedVisitInfo, setSelectedVisitInfo] =
		useState<JoinedVisit | null>(null);

	const openInfoModal = useCallback(
		(index: number) => {
			setSelectedVisitInfo(visits[index]);
		},
		[visits]
	);

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
						["upcoming", "requested-rejected"].includes(type) ? (
							<InfoIcon
								key={visit.id}
								onClick={() => openInfoModal(index)}
							/>
						) : (
							<RowArrow
								key={visit.id}
								style={{ width: "1rem" }}
								onClick={() => openInfoModal(index)}
							/>
						),
					] as TupleOfLength<ReactNode, 5>;
				} else {
					return (
						<VisitRow
							type={type}
							key={visit.id}
							data={visit}
							onClick={() => openInfoModal(index)}
						/>
					);
				}
			}),
		[isMobile, openInfoModal, type, visits]
	);

	if (rows.length === 0)
		return (
			<span id={styles.empty}>
				{type === "upcoming"
					? "אין ביקורים לתאריך זה"
					: type === "requested-pending"
					? "אין בקשות חדשות"
					: "אין בקשות שנדחו"}
			</span>
		);

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
