"use client";

import { useCallback, useMemo, useState } from "react";
import styles from "./visit-rows.module.scss";
import { JoinedVisit } from "@/utils/dbTypes";

import VisitRow from "./VisitRow";
import VisitInfoDialog from "./VisitInfoDialog";

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

	const rows = useMemo(
		() =>
			visits.map((visit, index) => (
				<VisitRow
					key={visit.id}
					data={visit}
					onClick={() => openInfoModal(index)}
				/>
			)),
		[openInfoModal, visits]
	);

	if (rows.length === 0)
		return <span id={styles.empty}>אין ביקורים לתאריך זה</span>;

	return (
		<>
			<section id={styles["visit-rows"]}>{rows}</section>
			<VisitInfoDialog
				type={type}
				visitInfo={selectedVisitInfo}
				onClose={() => setSelectedVisitInfo(null)}
			/>
		</>
	);
}
