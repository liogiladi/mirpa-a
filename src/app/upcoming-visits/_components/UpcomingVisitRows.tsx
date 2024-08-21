import VisitRows from "@/components/visits/VisitRows";
import Visits from "@/server/visits";
import { getDateString } from "@/utils/dates";
import { OrderDirection, SEARCH_QUERIES, Sort } from "@/utils/searchQueries";
import { SearchParams } from "@/utils/types";

type Props = {
	searchParams: SearchParams;
};

export default async function UpcomingVisitRows({ searchParams }: Props) {
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

	return <VisitRows type="upcoming" visits={visits || []} />;
}
