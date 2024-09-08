import { Suspense } from "react";
import { Metadata } from "next";
import styles from "@/styles/visits-page.module.css";

import { SearchParams } from "@/utils/types";
import {
	FilterIdToInfo,
	PATIENT_FILTER_ID_TO_INFO,
	VISITOR_FILTER_ID_TO_INFO,
	EXTRA_VISITOR_FILTER_ID_TO_INFO,
	VISIT_FILTER_ID_TO_INFO,
	VISIT_DATETIME_FILTER_ID_TO_INFO,
} from "@/utils/filters";
import { Assertions } from "@/server/assertions";

import LoadingDataFallback from "@/components/general/LoadingDataFallback";
import RequestedVisitRows from "./_components/RequestedVisitRows";
import StatusFilter from "./_components/StatusFilter";
import Filters from "@/components/visits/Filters";
import Sorts from "@/components/visits/Sorts";

const ACCORDION_INFOS: readonly FilterIdToInfo<any>[] = Object.freeze([
	PATIENT_FILTER_ID_TO_INFO,
	{
		...VISITOR_FILTER_ID_TO_INFO,
		...EXTRA_VISITOR_FILTER_ID_TO_INFO,
	},
	{ ...VISIT_FILTER_ID_TO_INFO, ...VISIT_DATETIME_FILTER_ID_TO_INFO },
]);

export const metadata: Metadata = {
	title: `משל"ט ביקורים | ביקורים עתידיים`,
	description: "תיאור התכלית של משלט ביקורים",
};

type Props = {
	searchParams: SearchParams;
};

export const revalidate = 0;

export default async function UpcomingVisits({ searchParams }: Props) {
	Assertions.requestedVisitsSearchParams(searchParams);

	return (
		<main className={styles["visits-page"]}>
			<h1>בקשות ביקור</h1>
			<StatusFilter />
			<section className={styles["buttons"]}>
				<section>
					<Filters type="requested" data={ACCORDION_INFOS} />
					<Sorts type="requested" />
				</section>
			</section>
			<Suspense fallback={<LoadingDataFallback />}>
				<RequestedVisitRows searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
