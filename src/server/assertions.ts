"server-only";

import { FILTER_VALIDATORS } from "@/utils/filters";
import { SEARCH_QUERIES } from "@/utils/searchQueries";
import { SearchParams } from "@/utils/types";
import assert from "assert";

export class Assertions {
	static upcomingVisitsSearchParams(
		params: URLSearchParams | SearchParams | undefined | null
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
								String(
									params.get(SEARCH_QUERIES.dateFilter.name)!
								)
							).getTime()
						),
			"Invalid date search param"
		);

		let validFilters = true;

		const filters = JSON.parse(
			`[${params.get(SEARCH_QUERIES.filters.name) || ""}]`
		) as [string, string][];

		filters.forEach(([key, value]) => {
			if (!(key in FILTER_VALIDATORS)) return (validFilters = false);

			const validator =
				FILTER_VALIDATORS[key as keyof typeof FILTER_VALIDATORS];
			if (validator instanceof RegExp && !validator.test(value))
				return (validFilters = false);
			if (typeof validator === "function" && !validator(value))
				return (validFilters = false);
		});

		assert(validFilters, "Invalid filters");

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

	static requestedVisitsSearchParams(
		params: URLSearchParams | SearchParams | undefined | null
	): asserts params {
		assert(params, "No search params");

		params = new URLSearchParams(
			params as URLSearchParams | Record<string, string>
		);

		let validFilters = true;

		const filters = JSON.parse(
			`[${params.get(SEARCH_QUERIES.filters.name) || ""}]`
		) as [string, string][];

		filters.forEach(([key, value]) => {
			if (!(key in FILTER_VALIDATORS)) return (validFilters = false);

			const validator =
				FILTER_VALIDATORS[key as keyof typeof FILTER_VALIDATORS];
			if (validator instanceof RegExp && !validator.test(value))
				return (validFilters = false);
			if (typeof validator === "function" && !validator(value))
				return (validFilters = false);
		});

		assert(validFilters, "Invalid filters");

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

	static patientsManagementSearchParams(
		params: URLSearchParams | SearchParams | undefined | null
	): asserts params {
		assert(params, "No search params");

		params = new URLSearchParams(
			params as URLSearchParams | Record<string, string>
		);

		assert(
			!params.get(SEARCH_QUERIES.sortPatientsBy.name) ||
				(SEARCH_QUERIES.sortPatientsBy.values.includes(
					params.get(SEARCH_QUERIES.sortBy.name) as any
				) &&
					SEARCH_QUERIES.orderDirection.values.includes(
						params.get(SEARCH_QUERIES.orderDirection.name) as any
					)),
			"Invalid sort search param"
		);
	}
}
