"use client";

import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./patients-form.module.scss";
import visitsPageStyles from "@/styles/visits-page.module.scss";

import { Tables } from "@/server/db.types";
import { deletePatients } from "@/server/actions";

import { getDateString, getTimeString } from "@/utils/dates";
import { TupleOfLength } from "@/utils/types";

import Table from "@/components/theme/Table";
import Button from "@/components/theme/Button";
import DeleteAlertDialog from "../DeleteAlertDialog";
import { useDetectMobile } from "@/contexts/detectMobile";

export type PatientInfoToDelete = Pick<
	Tables<"patients">,
	"first_name" | "last_name"
>;

type Props = {
	data: Tables<"patients">[];
};

export default function PatientsForm({ data }: Props) {
	const deleteDialogRef = useRef<HTMLDialogElement>(null);
	const isMobile = useDetectMobile();

	const router = useRouter();
	const [selectedPatientCIDs, setSelectedPatientCIDs] = useState<
		Map<string, PatientInfoToDelete>
	>(new Map());

	const handleRowSelectionToggle = useCallback(
		(
			patient: Pick<
				(typeof data)[number],
				"cid" | "first_name" | "last_name"
			>
		) => {
			const newMap = new Map(selectedPatientCIDs);

			if (!selectedPatientCIDs.has(patient.cid)) {
				newMap.set(patient.cid, {
					first_name: patient.first_name,
					last_name: patient.last_name,
				});
			} else {
				newMap.delete(patient.cid);
			}

			setSelectedPatientCIDs(newMap);
		},
		[selectedPatientCIDs]
	);

	const rows: TupleOfLength<ReactNode, 9>[] = useMemo(
		() =>
			data.map((patient) => {
				const creationDate = new Date(patient.created_at);

				return [
					<input
						key={patient.cid}
						type="checkbox"
						checked={selectedPatientCIDs.has(patient.cid)}
						onChange={() => {
							if (!isMobile) handleRowSelectionToggle(patient);
						}}
					/>,
					null,
					patient.first_name,
					patient.last_name,
					patient.cid,
					"גיל",
					getDateString(creationDate, { format: true }),
					getTimeString(creationDate),
					patient.address,
				];
			}),
		[data, handleRowSelectionToggle, isMobile, selectedPatientCIDs]
	);

	return (
		<form
			id={styles["patients-form"]}
			action={deletePatients.bind(
				null,
				Array.from(selectedPatientCIDs.keys())
			)}
			onSubmit={() => deleteDialogRef.current?.close()}
		>
			<section>
				<Table
					width={9}
					columns={[
						"",
						"תמונה",
						"שם פרטי",
						"שם משפחה",
						"תעודת זהות",
						"גיל",
						"תאריך קליטה",
						"שעת קליטה",
						"כתובת",
					]}
					rows={rows}
					onRowClick={(rowData) => {
						if (isMobile) {
							handleRowSelectionToggle({
								first_name: rowData[2],
								last_name: rowData[3],
								cid: rowData[4],
							});
						}
					}}
				/>
			</section>
			<section id={styles.buttons} className={visitsPageStyles.buttons}>
				<Button
					type="button"
					variant="outline"
					colorVariant="primary"
					onClick={() => router.replace("/patients-management/add")}
				>
					הוספה
				</Button>
				<Button
					type="button"
					variant="outline"
					colorVariant="warning"
					disabled={selectedPatientCIDs.size === 0}
					onClick={() => deleteDialogRef.current?.showModal()}
				>
					מחיקה
				</Button>
			</section>
			<DeleteAlertDialog
				ref={deleteDialogRef}
				patientsInfosToDelete={selectedPatientCIDs}
			/>
		</form>
	);
}
