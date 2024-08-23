import { Suspense } from "react";
import styles from "./page.module.scss";
import { SearchParams } from "@/utils/types";

import LoadingDataFallback from "@/components/general/LoadingDataFallback";
import PageHeading from "@/components/general/PageHeading";
import PatientsData from "./_components/PatientsData";

type Props = {
	searchParams: SearchParams;
};

export default async function PatientsManagement({ searchParams }: Props) {
	return (
		<main id={styles["patients-management"]}>
			<PageHeading>ניהול מטופלים</PageHeading>
			<Suspense fallback={<LoadingDataFallback />}>
				<PatientsData searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
