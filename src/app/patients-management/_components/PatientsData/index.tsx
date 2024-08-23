import db from "@/server/db";
import { SearchParams } from "@/utils/types";
import PatientsForm from "../PatientsForm";

type Props = {
	searchParams: SearchParams;
};

export default async function PatientsData({ searchParams }: Props) {
	const { data, error } = await db.from("patients").select("*");

	if (error) {
		//TODO: Error page 500
	}

	if (!data || data.length === 0) {
		return <span>אין מטופלים בעת זו</span>;
	}

	return <PatientsForm data={data} />;
}
