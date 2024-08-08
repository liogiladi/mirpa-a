"use client";

import { useCallback, useMemo, useState } from "react";
import styles from "./visit-rows.module.scss";

import VisitRow from "./VisitRow";
import VisitInfoDialog from "./VisitInfoDialog";

import { JoinedVisit } from "@/server/visits";

type Props = {
	visits: NonNullable<JoinedVisit>[];
};

export default function VisitRows({ visits }: Props) {
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
		[visits]
	);

	if (rows.length === 0)
		return <span id={styles.empty}>אין ביקורים לתאריך זה</span>;

	return (
		<>
			<section id={styles["visit-rows"]}>{rows}</section>
			<VisitInfoDialog
				visitInfo={selectedVisitInfo}
				onClose={() => setSelectedVisitInfo(null)}
			/>
		</>
	);
}
