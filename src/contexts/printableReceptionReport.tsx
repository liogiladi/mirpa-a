/* eslint-disable @next/next/no-img-element */
"use client";

import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import styles from "@/styles/reception-report.module.scss";

import { Tables } from "@/server/db.types";
import { getDateString, getTimeString } from "@/utils/dates";

import Printable from "@/components/general/Printable";
import FullLogoIcon from "@/components/icons/FullLogoIcon";
import PDFPage from "@/components/pdf/PDFPage";
import { PatientData } from "@/app/patients-management/_components/PatientsForm";

const PATIENT_INFO_TO_LABELS: Partial<
	Record<keyof Tables<"patients">, string>
> = Object.freeze({
	first_name: "שם פרטי",
	last_name: "שם משפחה",
	cid: "מספר זהות",
	birth_date: "תאריך לידה",
});

type Data = PatientData | null;

const ReceptionReportContext = createContext<Dispatch<
	SetStateAction<Data>
> | null>(null);

export function useReceptionReportData() {
	return useContext(ReceptionReportContext);
}

export function ReceptionReportContextProvider({
	children,
}: PropsWithRequiredChildren) {
	const [data, setData] = useState<Data>(null);

	useEffect(() => {
		if (data) {
			setTimeout(() => {
				window.print();
			}, 200);
		}
	}, [data]);

	return (
		<ReceptionReportContext.Provider value={setData}>
			{children}
			{data && (
				<Printable id={styles.container}>
					<PDFPage title={`דוח קליטת מטופל`}>
						<section id={styles["personal-info"]}>
							<section>
								{Object.entries(PATIENT_INFO_TO_LABELS).map(
									([key, value]) => (
										<span key={key}>
											<strong>{value}:</strong>
											{data[key as keyof typeof data]}
										</span>
									)
								)}
							</section>
							<section>
								<img
									src={
										data.profilePictureURL
											? `${
													data.profilePictureURL
											  }?${Date.now()}`
											: "data:image/png;base64,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"
									}
									alt="profile-pic"
								/>
								<section>
									{new Array(10).fill(0).map((_, index) => (
										<span
											key={`upper-spans-${index}`}
										></span>
									))}
									<span>
										<strong>כתובת מגורים:</strong>
										{data.address || "אין נתון"}
									</span>
									{new Array(10).fill(0).map((_, index) => (
										<span
											key={`lower-spans-${index}`}
										></span>
									))}
								</section>
							</section>
							<section>
								{new Array(43).fill(0).map((_, index) => (
									<span key={`body-spans-${index}`}></span>
								))}
							</section>
						</section>
						<section id={styles["receiever-info"]}>
							<span>
								<strong>מספר מזהה קולט:</strong>
								<br />
								{data.receiver_id}
							</span>
							<span>
								<strong>זמן הקליטה:</strong>
								<br />
								{`${getDateString(
									new Date(data.created_at)
								)} ${getTimeString(new Date(data.created_at))}`}
							</span>

							<img
								src={`${data.signaturePictureURL}`}
								alt="receiver signature"
							/>
						</section>
						<FullLogoIcon id={styles["watermark"]} />
					</PDFPage>
				</Printable>
			)}
		</ReceptionReportContext.Provider>
	);
}
