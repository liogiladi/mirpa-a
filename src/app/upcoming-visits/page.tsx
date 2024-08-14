import styles from "./upcoming-visits.module.scss";

import Visits from "@/server/visits";
import { Assertions } from "@/server/assertions";

import { getDateString } from "@/utils/dates";
import { OrderDirection, SEARCH_QUERIES, Sort } from "@/utils/searchQueries";
import { SearchQuery } from "@/utils/types";
import {
	EXTRA_VISITOR_FILTER_ID_TO_INFO,
	PATIENT_FILTER_ID_TO_INFO,
	VISIT_FILTER_ID_TO_INFO,
	VISITOR_FILTER_ID_TO_INFO,
} from "@/utils/filters";

import Filters from "@/components/visits/Filters";
import Sorts from "@/components/visits/Sorts";
import VisitRows from "@/components/visits/VisitRows";
import DateFilter from "./_components/DateFilter";
import PrintForm from "./_components/PrintForm";

const ACCORDION_INFOS = Object.freeze([
	PATIENT_FILTER_ID_TO_INFO,
	{ ...VISITOR_FILTER_ID_TO_INFO, ...EXTRA_VISITOR_FILTER_ID_TO_INFO },
	VISIT_FILTER_ID_TO_INFO,
]);

type Props = {
	searchParams?: SearchQuery;
};

export const revalidate = 0;

export default async function UpcomingVisits({ searchParams }: Props) {
	Assertions.visitsSearchParams(searchParams!);

	const dateFilter = String(
		searchParams[SEARCH_QUERIES.dateFilter.name] ||
			getDateString(new Date())
	);

	const dateRange =
		searchParams[SEARCH_QUERIES.dateFilterType.name] ===
		SEARCH_QUERIES.dateFilterType.value
			? SEARCH_QUERIES.dateFilter.values.min
			: SEARCH_QUERIES.dateFilter.values.specific;

	const otherFilters = searchParams[SEARCH_QUERIES.filters.name]
		? JSON.parse(`[${searchParams[SEARCH_QUERIES.filters.name]}]`)
		: [];

	const visits = await Visits.getAllFilteredUpcomingJoined({
		date: {
			value: dateFilter,
			range: dateRange,
		},
		filters: otherFilters,
		sort:
			searchParams[SEARCH_QUERIES.sortBy.name] &&
			searchParams[SEARCH_QUERIES.orderDirection.name]
				? {
						by: searchParams[SEARCH_QUERIES.sortBy.name]! as Sort,
						direction: searchParams[
							SEARCH_QUERIES.orderDirection.name
						]! as OrderDirection,
				  }
				: undefined,
	});

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
			{globalThis.isMobile ? (
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
			<VisitRows type="upcoming" visits={visits || []} />
		</main>
	);
}
