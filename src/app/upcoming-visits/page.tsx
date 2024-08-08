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

import DateFilter from "./_components/DateFilter";
import VisitRows from "./_components/VisitRows";
import PrintForm from "./_components/PrintForm";
import Sorts from "./_components/Sorts";
import Filters from "./_components/Filters";

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
		searchParams[SEARCH_QUERIES.dateFilter.name] || getDateString(new Date())
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
							new Date(String(searchParams[SEARCH_QUERIES.dateFilter.name])),
							{ format: true }
					  )}`
					: `ביקורים מ-${getDateString(new Date(), {
							format: true,
					  })}`}
			</h1>
			<DateFilter />
			<section id={styles["buttons"]}>
				<div>
					<PrintForm />
				</div>
				<div>
					<Filters data={ACCORDION_INFOS} />
					<Sorts />
				</div>
			</section>
			<VisitRows visits={visits || []} />
		</main>
	);
}
