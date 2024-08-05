import "server-only";

import db from "./db";
import { SEARCH_QUERIES } from "@/utils/searchQueries";

export default class Visits {
	/**
	 *
	 * @param dateFilter yyyy-MM-dd
	 * @param dateFilterType `specific` - show visits **on** the given date. `min` - show visits **from** the given date
	 * @returns
	 */
	static async getAllFilteredUpcomingJoined(
		dateFilter: string,
		dateFilterType: keyof typeof SEARCH_QUERIES.dateFilter.values = SEARCH_QUERIES
			.dateFilter.values.specific
	) {
		let query = db
			.from("visits")
			.select(
				`*, patients(cid, first_name, last_name),
				visitor:visitors!visits_visitor_id_fkey(first_name, last_name, relation, phone_number, email),
				extra_visitor:visitors!visits_extra_visitor_id_fkey(first_name, last_name, relation, phone_number, email)`
			)
			.gte("datetime", dateFilter)
			.eq("approved", true)
			.order("datetime", { ascending: true });

		if (dateFilterType === "specific") {
			query = query.lte("datetime", dateFilter);
		}

		return query;
	}
}

export type UpcomingVisitRow =
	| NonNullable<
			Awaited<
				ReturnType<(typeof Visits)["getAllFilteredUpcomingJoined"]>
			>["data"]
	  >[number]
	| null;
