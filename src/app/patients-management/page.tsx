import { Suspense } from "react";
import styles from "./page.module.css";
import { SearchParams } from "@/utils/types";

import LoadingDataFallback from "@/components/general/LoadingDataFallback";
import PatientsData from "./_components/PatientsData";

type Props = {
	searchParams: SearchParams;
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function PatientsManagement({ searchParams }: Props) {
	return (
		<main id={styles["patients-management"]}>
			<h1>ניהול מטופלים</h1>
			<Suspense fallback={<LoadingDataFallback />}>
				<PatientsData searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
