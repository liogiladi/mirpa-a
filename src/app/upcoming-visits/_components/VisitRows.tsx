"use client";

import { useCallback, useState } from "react";
import styles from "./visit-rows.module.scss";

import type { UpcomingVisitRow } from "../page";

import VisitRow from "./VisitRow";
import VisitInfoDialog from "./VisitInfoDialog";

type Props = {
	visits: NonNullable<UpcomingVisitRow>[];
};

export default function VisitRows({ visits }: Props) {
	const [selectedVisitInfo, setSelectedVisitInfo] =
		useState<UpcomingVisitRow | null>(null);

	const openInfoModal = useCallback(
		(index: number) => {
			setSelectedVisitInfo(visits[index]);
		},
		[visits]
	);

	if (visits.length === 0)
		return <span id={styles.empty}>אין ביקורים לתאריך זה</span>;

	return (
		<>
			<section id={styles["visit-rows"]}>
				{visits.map((visit, index) => (
					<VisitRow
						key={visit.id}
						data={visit}
						onClick={() => openInfoModal(index)}
					/>
				))}
			</section>
			<VisitInfoDialog
				visitInfo={selectedVisitInfo}
				onClose={() => setSelectedVisitInfo(null)}
			/>
		</>
	);
}
