import db from "@/server/db";
import { Tables } from "@/server/db.types";
import { SearchParams } from "@/utils/types";
import PatientsForm, { PatientData } from "../PatientsForm";
import { Assertions } from "@/server/assertions";
import { PatientsSort, SEARCH_QUERIES } from "@/utils/searchQueries";

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
		dataWithProfilePictures.push({
			...patient,
			profilePictureURL: `${
				db.storage
					.from("pictures")
					.getPublicUrl(`patients-profiles/${patient.cid}.png`).data
					.publicUrl
			}?${Date.now()}`,
		});
	}

	return <PatientsForm data={dataWithProfilePictures} />;
}
