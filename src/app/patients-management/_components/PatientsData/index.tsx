import db from "@/server/db";
import { Tables } from "@/server/db.types";
import { Assertions } from "@/server/assertions";

import { SearchParams } from "@/utils/types";
import { PatientsSort, SEARCH_QUERIES } from "@/utils/searchQueries";
import { ReceptionReportContextProvider } from "@/contexts/printableReceptionReport";
import PatientsForm, { PatientData } from "../PatientsForm";

type Props = {
	searchParams: SearchParams;
};

const PATIENT_SORT_TO_SQL_ID = {
	"state-id": "cid",
	"first-name": "first_name",
	"last-name": "last_name",
	"birth-date": "birth_date",
	address: "address",
	"reception-time": "created_at",
} as const satisfies Record<PatientsSort, keyof Tables<"patients">>;

export default async function PatientsData({ searchParams }: Props) {
	Assertions.patientsManagementSearchParams(searchParams);

	let query = db.from("patients").select("*");

	if (searchParams[SEARCH_QUERIES.sortPatientsBy.name]) {
		const columnToSortBy =
			PATIENT_SORT_TO_SQL_ID[
				searchParams[
					SEARCH_QUERIES.sortPatientsBy.name
				] as keyof typeof PATIENT_SORT_TO_SQL_ID
			];

		const ascending =
			searchParams[SEARCH_QUERIES.orderDirection.name] === "DESC"
				? false
				: true;

		query = query.order(columnToSortBy, { ascending });
	}

	const { data, error } = await query;

	if (error || !data) {
		throw error;
	}

	const dataWithProfilePictures: PatientData[] = [];

	for (const patient of data) {
		// Note: not accurate but shall suffice for the moment
		const age = Math.floor(
			(Date.now() - new Date(patient.birth_date).getTime()) / 3.15576e10
		);

		let profilePictureURL: string | null = null;

		const { data, error: fileSearchError } = await db.storage
			.from("pictures")
			.list(`patients-profiles`);

		const fileExists = data?.find(
			(file) => file.name === `${patient.cid}.png`
		);

		if (!fileSearchError && fileExists) {
			profilePictureURL = db.storage
				.from("pictures")
				.getPublicUrl(
					`${patient.profile_img_bucket_path}?${Date.now()}`
				).data.publicUrl;
		}

		dataWithProfilePictures.push({
			...patient,
			profilePictureURL,
			signaturePictureURL: db.storage
				.from("pictures")
				.getPublicUrl(
					`${
						patient.reciever_signature_img_bucket_path
					}?${Date.now()}`
				).data.publicUrl,
			age,
		});
	}
	console.log(dataWithProfilePictures);

	return (
		<ReceptionReportContextProvider>
			<PatientsForm data={dataWithProfilePictures} />
		</ReceptionReportContextProvider>
	);
}
