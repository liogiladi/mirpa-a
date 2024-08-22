import { Suspense } from "react";
import { Metadata } from "next";
import styles from "@/styles/visits-page.module.scss";

import { Assertions } from "@/server/assertions";

import { isMobileNodeJS } from "@/utils/mobile";
import { getDateString } from "@/utils/dates";
import { SEARCH_QUERIES } from "@/utils/searchQueries";
import { SearchParams } from "@/utils/types";
import {
	EXTRA_VISITOR_FILTER_ID_TO_INFO,
	FilterIdToInfo,
	PATIENT_FILTER_ID_TO_INFO,
	VISIT_FILTER_ID_TO_INFO,
	VISITOR_FILTER_ID_TO_INFO,
} from "@/utils/filters";

import Filters from "@/components/visits/Filters";
import Sorts from "@/components/visits/Sorts";
import DateFilter from "./_components/DateFilter";
import PrintForm from "./_components/PrintForm";
import UpcomingVisitRows from "./_components/UpcomingVisitRows";
import LoadingDataFallback from "@/components/LoadingDataFallback";

const ACCORDION_INFOS: readonly FilterIdToInfo<any>[] = Object.freeze([
	PATIENT_FILTER_ID_TO_INFO,
	{ ...VISITOR_FILTER_ID_TO_INFO, ...EXTRA_VISITOR_FILTER_ID_TO_INFO },
	VISIT_FILTER_ID_TO_INFO,
]);

export const metadata: Metadata = {
	title: `משל"ט ביקורים | ביקורים עתידיים`,
	description: "תיאור התכלית של משלט ביקורים",
};

type Props = {
	searchParams?: SearchParams;
};

export const revalidate = 0;

export default async function UpcomingVisits({ searchParams }: Props) {
	Assertions.upcomingVisitsSearchParams(searchParams);

	return (
		<main className={styles["visits-page"]}>
			<h1>
				{searchParams[SEARCH_QUERIES.dateFilter.name]
					? `ביקורים ל-${getDateString(
							new Date(
								String(
									searchParams[SEARCH_QUERIES.dateFilter.name]
								)
							),
							{ format: true }
					  )}`
					: `ביקורים מ-${getDateString(new Date(), {
							format: true,
					  })}`}
			</h1>

			<DateFilter />
			{(await isMobileNodeJS()) ? (
				<section className={styles["buttons"]}>
					<Filters type="upcoming" data={ACCORDION_INFOS} />
					<PrintForm />
					<Sorts type="upcoming" />
				</section>
			) : (
				<section className={styles["buttons"]}>
					<section>
						<PrintForm />
					</section>
					<section>
						<Filters type="upcoming" data={ACCORDION_INFOS} />
						<Sorts type="upcoming" />
					</section>
				</section>
			)}
			<Suspense fallback={<LoadingDataFallback />}>
				<UpcomingVisitRows searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
