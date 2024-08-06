import "server-only";

import db from "./db";
import { OrderDirection, SEARCH_QUERIES, Sort } from "@/utils/searchQueries";

export default class Visits {
	static async getAllFilteredUpcomingJoined(options: QueryOptions) {
		const { filters, sort } = options;
		let query = db
			.from("visits")
			.select(
				`*, patients(cid, first_name, last_name),
				visitor:visitors!visits_visitor_id_fkey(cid, first_name, last_name, relation, phone_number, email),
				extra_visitor:visitors!visits_extra_visitor_id_fkey(first_name, last_name, relation, phone_number, email)`
			)
			.eq("approved", true);

		if (filters?.date) {
			query = query.gte("datetime", filters.date.value);

			if (filters.date.range === "specific") {
				query = query.lte("datetime", filters.date.value);
			}
		}

		if (sort) {
			query = query.order(sortValueToColumn(sort.by), {
				ascending: sort.direction === "ASC",
			});
		} else {
			query = query.order("datetime");
		}

		const { data, error } = await query;

		if (error) throw error;

		return data;
	}
}

export type UpcomingVisitRow =
	| NonNullable<
			Awaited<ReturnType<(typeof Visits)["getAllFilteredUpcomingJoined"]>>
	  >[number]
	| null;

type Filters = {
	date: {
		value: string;
		range: keyof typeof SEARCH_QUERIES.dateFilter.values;
	};
};

type SortOptions = {
	by: Sort;
	direction: OrderDirection;
};

type QueryOptions = Partial<{
	filters: Filters;
	sort: SortOptions;
}>;

function sortValueToColumn(sort: Sort) {
	switch (sort) {
		case "visit-datetime":
			return "datetime";
		case "visit-creation-datetime":
			return "created_at";
		case "patient-name":
			return "patients(first_name)";
		case "visitor-name":
			return "visitor(first_name)";
	}
}
