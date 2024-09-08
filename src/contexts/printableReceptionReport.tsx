"use client";

import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import styles from "@/styles/reception-report.module.css";
import defaultProfile from "../../public/default-profile-pic.png";

import { Tables } from "@/server/db.types";
import { getDateString, getTimeString } from "@/utils/dates";

import Printable from "@/components/general/Printable";
import FullLogoIcon from "@/components/icons/FullLogoIcon";
import PDFPage from "@/components/pdf/PDFPage";
import { PatientData } from "@/app/patients-management/_components/PatientsForm";
import Image from "next/image";

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
								<Image
									src={
										data.profilePictureURL
											? `${
													data.profilePictureURL
											  }?${Date.now()}`
											: defaultProfile.src
									}
									width={100}
									height={200}
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

							<Image
								src={`${data.signaturePictureURL}`}
								alt="receiver signature"
								width={100}
								height={100}
							/>
						</section>
						<FullLogoIcon id={styles["watermark"]} />
					</PDFPage>
				</Printable>
			)}
		</ReceptionReportContext.Provider>
	);
}
