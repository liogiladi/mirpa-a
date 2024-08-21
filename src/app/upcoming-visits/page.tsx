import { Metadata } from "next";
import styles from "./upcoming-visits.module.scss";

import { Assertions } from "@/server/assertions";

import { isMobileNodeJS } from "@/utils/mobile";
import { getDateString } from "@/utils/dates";
import { SEARCH_QUERIES } from "@/utils/searchQueries";
import { SearchParams } from "@/utils/types";
import {
	EXTRA_VISITOR_FILTER_ID_TO_INFO,
	PATIENT_FILTER_ID_TO_INFO,
	VISIT_FILTER_ID_TO_INFO,
	VISITOR_FILTER_ID_TO_INFO,
} from "@/utils/filters";

import Filters from "@/components/visits/Filters";
import Sorts from "@/components/visits/Sorts";
import DateFilter from "./_components/DateFilter";
import PrintForm from "./_components/PrintForm";
import UpcomingVisitRows from "./_components/UpcomingVisitRows";
import { Suspense } from "react";
import LoadingDataFallback from "@/components/LoadingDataFallback";

const ACCORDION_INFOS = Object.freeze([
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
	Assertions.visitsSearchParams(searchParams!);

	return (
		<main id={styles["upcoming-visits-page"]}>
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
				<section id={styles["buttons"]}>
					<Filters type="upcoming" data={ACCORDION_INFOS} />
					<PrintForm />
					<Sorts type="upcoming" />
				</section>
			) : (
				<section id={styles["buttons"]}>
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
