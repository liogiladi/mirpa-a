"use client";

import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./patients-form.module.css";
import visitsPageStyles from "@/styles/visits-page.module.css";

import { Tables } from "@/server/db.types";
import { deletePatients } from "@/server/actions";

import { useDetectMobile } from "@/contexts/detectMobile";
import { getDateString, getTimeString } from "@/utils/dates";
import { TupleOfLength } from "@/utils/types";
import { PatientsSort, SEARCH_QUERIES } from "@/utils/searchQueries";

import { useReceptionReportData } from "@/contexts/printableReceptionReport";

import toast from "react-hot-toast";
import Table from "@/components/theme/Table";
import Button from "@/components/theme/Button";
import DeleteAlertDialog from "../DeleteAlertDialog";

export type PatientInfoToDelete = Pick<
	Tables<"patients">,
	"first_name" | "last_name"
>;

export type PatientData = Tables<"patients"> & {
	profilePictureURL: string | null;
	signaturePictureURL: string;
	age: number;
};

const SORTABLE_COLUMN_ID_TO_LABEL: Record<PatientsSort, string> = {
	"first-name": "שם פרטי",
	"last-name": "שם משפחה",
	"state-id": "תעודת זהות",
	"birth-date": "גיל",
	address: "כתובת",
	"reception-time": "זמן קליטה",
};

type Props = {
	data: PatientData[];
};

export default function PatientsForm({ data }: Props) {
	const deleteDialogRef = useRef<HTMLDialogElement>(null);
	const isMobile = useDetectMobile();
	const currentParams = useSearchParams();
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

	const columns = useMemo(
		() =>
			[
				"",
				"תמונה",
				...Object.entries(SORTABLE_COLUMN_ID_TO_LABEL).map(
					([id, label]) => (
						<div key={id}>
							<button
								className={styles["sort-button"]}
								type="button"
								onClick={() => {
									const searchParams = new URLSearchParams(
										currentParams
									);
									searchParams.set(
										SEARCH_QUERIES.sortPatientsBy.name,
										id
									);

									if (
										currentParams.get(
											SEARCH_QUERIES.sortPatientsBy.name
										) === id
									) {
										searchParams.set(
											SEARCH_QUERIES.orderDirection.name,
											currentParams.get(
												SEARCH_QUERIES.orderDirection
													.name
											) ===
												SEARCH_QUERIES.orderDirection
													.values[0]
												? SEARCH_QUERIES.orderDirection
														.values[1]
												: SEARCH_QUERIES.orderDirection
														.values[0]
										);
									}

									router.push(
										`/patients-management?${searchParams.toString()}`
									);
								}}
							>
								{label}
								<span
									data-used={
										currentParams.get(
											SEARCH_QUERIES.sortPatientsBy.name
										) === id
									}
									data-desc={
										currentParams.get(
											SEARCH_QUERIES.orderDirection.name
										) === "DESC"
									}
								>
									{">"}
								</span>
							</button>
						</div>
					)
				),
				'דוח" קליטה',
			] as TupleOfLength<ReactNode, 9>,
		[router, currentParams]
	);

	const setReceptionData = useReceptionReportData();

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
					// eslint-disable-next-line @next/next/no-img-element
					<img
						key={patient.cid}
						width={30}
						height={30}
						src={
							patient.profilePictureURL ||
							"/default-profile-pic.png"
						}
						alt="patient profile pic"
						onError={(e) =>
							(e.currentTarget.src = "/default-profile-pic.png")
						}
					/>,
					patient.first_name,
					patient.last_name,
					patient.cid,
					patient.age.toFixed(1),
					patient.address,
					`${getDateString(creationDate, {
						format: true,
					})} ${getTimeString(creationDate)}`,
					<button
						type="button"
						key={`report-${patient.cid}`}
						onClick={() => {
							setReceptionData?.((prev) => {
								if (prev?.cid === patient.cid) {
									window.print();
									return prev;
								}

								return {
									...patient,
									signaturePictureURL:
										patient.signaturePictureURL!,
								};
							});
						}}
					>
						הדפסה
					</button>,
				];
			}),
		[
			data,
			handleRowSelectionToggle,
			isMobile,
			selectedPatientCIDs,
			setReceptionData,
		]
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
						width={9}
						columns={columns}
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
					title={
						selectedPatientCIDs.size === 0
							? "יש לבחור מטופלים למחיקה"
							: undefined
					}
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
