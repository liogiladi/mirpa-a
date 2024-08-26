"use client";

import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./patients-form.module.scss";
import visitsPageStyles from "@/styles/visits-page.module.scss";

import { Tables } from "@/server/db.types";
import { deletePatients } from "@/server/actions";

import { useDetectMobile } from "@/contexts/detectMobile";
import { getDateString, getTimeString } from "@/utils/dates";
import { TupleOfLength } from "@/utils/types";

import toast from "react-hot-toast";
import Table from "@/components/theme/Table";
import Button from "@/components/theme/Button";
import DeleteAlertDialog from "../DeleteAlertDialog";

export type PatientInfoToDelete = Pick<
	Tables<"patients">,
	"first_name" | "last_name"
>;

export type PatientData = Tables<"patients"> & { profilePictureURL: string };

type Props = {
	data: PatientData[];
};

export default function PatientsForm({ data }: Props) {
	const deleteDialogRef = useRef<HTMLDialogElement>(null);
	const isMobile = useDetectMobile();

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

	const rows: TupleOfLength<ReactNode, 10>[] = useMemo(
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
					<Image
						key={patient.cid}
						width={30}
						height={30}
						src={patient.profilePictureURL}
						alt="patient profile pic"
						onError={(e) =>
							(e.currentTarget.src = "/default-profile-pic.png")
						}
						unoptimized
					/>,
					patient.first_name,
					patient.last_name,
					patient.cid,
					"גיל",
					getDateString(creationDate, { format: true }),
					getTimeString(creationDate),
					patient.address,
					<Link
						key={`report-${patient.cid}`}
						href={`/patients-management/reception-report/${patient.cid}`}
						target="_blank"
					>
						צפייה
					</Link>,
				];
			}),
		[data, handleRowSelectionToggle, isMobile, selectedPatientCIDs]
	);

	return (
		<form
			id={styles["patients-form"]}
			action={async () => {
				try {
					await deletePatients(
						Array.from(selectedPatientCIDs.keys())
					);
				} catch (error) {
					toast.error((error as Error).message);
				}
			}}
			onSubmit={() => {
				deleteDialogRef.current?.close();
				setSelectedPatientCIDs(new Map());
			}}
		>
			{data.length === 0 ? (
				<span>אין מטופלים בעת זו</span>
			) : (
				<section>
					<Table
						width={10}
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
							`דו"ח קליטה`,
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
			)}

			<section id={styles.buttons} className={visitsPageStyles.buttons}>
				<Link href={"/patients-management/add"}>
					<Button
						type="button"
						variant="outline"
						colorVariant="primary"
					>
						הוספה
					</Button>
				</Link>
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
