import db from "@/server/db";
import { SearchParams } from "@/utils/types";
import PatientsForm, { PatientData } from "../PatientsForm";

type Props = {
	searchParams: SearchParams;
};

export default async function PatientsData({ searchParams }: Props) {
	const { data, error } = await db.from("patients").select("*");

	if (error || !data) {
		//TODO: Error page 500
		return;
	}

	const dataWithProfilePictures: PatientData[] = [];

	for (const patient of data) {
		dataWithProfilePictures.push({
			...patient,
			profilePictureURL: db.storage
				.from("pictures")
				.getPublicUrl(`patients-profiles/${patient.cid}.png`).data
				.publicUrl,
		});
	}

	return <PatientsForm data={dataWithProfilePictures} />;
}
