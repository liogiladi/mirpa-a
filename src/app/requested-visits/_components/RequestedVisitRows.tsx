import Visits from "@/server/visits";

import {
	SEARCH_QUERIES,
	Sort,
	OrderDirection,
	VisitStatus,
} from "@/utils/searchQueries";
import { SearchParams } from "@/utils/types";

import VisitRows from "@/components/visits/VisitRows";

type Props = {
	searchParams: SearchParams;
};

export default async function RequestedVisitRows({ searchParams }: Props) {
	const filters = searchParams[SEARCH_QUERIES.filters.name]
		? JSON.parse(`[${searchParams[SEARCH_QUERIES.filters.name]}]`)
		: [];

	const visits = await Visits.getAllFiltereRequestedJoined({
		status: searchParams[SEARCH_QUERIES.status.name] as VisitStatus,
		filters: filters,
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

	const status = searchParams[SEARCH_QUERIES.status.name];

	return (
		<VisitRows
			type={`requested-${status as VisitStatus}`}
			visits={visits || []}
		/>
	);
}
