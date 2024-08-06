"serverr-only";

import { SEARCH_QUERIES } from "@/utils/searchQueries";
import { SearchQuery } from "@/utils/types";
import assert from "assert";

export class Assertions {
	static visitsSearchParams(
		params: URLSearchParams | SearchQuery
	): asserts params {
		assert(params, "No search params");

		params = new URLSearchParams(
			params as URLSearchParams | Record<string, string>
		);

		assert(
			params.get(SEARCH_QUERIES.dateFilterType.name)
				? params.get(SEARCH_QUERIES.dateFilterType.name) ===
						SEARCH_QUERIES.dateFilterType.value
				: params.get(SEARCH_QUERIES.dateFilter.name) &&
						!isNaN(
							new Date(
								String(params.get(SEARCH_QUERIES.dateFilter.name)!)
							).getTime()
						),
			"Invalid date search param"
		);

		assert(
			!params.get(SEARCH_QUERIES.sortBy.name) ||
				(SEARCH_QUERIES.sortBy.values.includes(
					params.get(SEARCH_QUERIES.sortBy.name) as any
				) &&
					SEARCH_QUERIES.orderDirection.values.includes(
						params.get(SEARCH_QUERIES.orderDirection.name) as any
					)),
			"Invalid sort search param"
		);
	}
}
