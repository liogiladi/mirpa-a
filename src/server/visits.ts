import "server-only";

import db from "./db";
import {
	Filter,
	OrderDirection,
	SEARCH_QUERIES,
	Sort,
} from "@/utils/searchQueries";
import { Tables } from "./db.types";
import { JoinedVisit } from "@/utils/dbTypes";

export default class Visits {
	static async getAllFilteredUpcomingJoined(
		options: QueryOptions
	): Promise<JoinedVisit[]> {
		const { date, filters, sort } = options;
		let query = db.from("joined_visits").select("*").eq("approved", true);

		if (date) {
			query = query.gte("datetime", date.value);

			if (date.range === "specific") {
				query = query.lte("datetime", date.value);
			}
		}

		if (filters) {
			for (const [filterId, value] of filters) {
				query = query.eq(filterIdToColumn(filterId), value);
			}
		}

		if (sort) {
			query = query.order(sortValueToColumn(sort.by), {
				ascending: sort.direction === "ASC",
			});
		} else {
			query = query.order("datetime");
		}

		const { data, error } = await query.returns<JoinedVisit[]>();

		if (error) throw error;

		return data;
	}
}

type SortOptions = {
	by: Sort;
	direction: OrderDirection;
};

type QueryOptions = Partial<{
	date: {
		value: string;
		range: keyof typeof SEARCH_QUERIES.dateFilter.values;
	};
	filters: [Filter[keyof Filter], string][];
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

function filterIdToColumn(filter: Filter[keyof Filter]) {
	switch (filter) {
		case "patient-first-name":
			return "patient ->> first_name";
		case "patient-surname":
			return "patient ->> last_name";
		case "patient-state-id":
			return "patient_cid";
		case "visitor-first-name":
			return "visitor ->> first_name";
		case "visitor-surname":
			return "visitor ->> last_name";
		case "visitor-state-id":
			return "visitor_id";
		case "visitor-email":
			return "visitor ->> email";
		case "visitor-phone-number":
			return "visitor ->> phone_number";
		case "visitor-familial-realtion":
			return "visitor ->> relation";
		case "extra-visitor-first-name":
			return "extra_visitor ->> first_name";
		case "extra-visitor-surname":
			return "extra_visitor ->> last_name";
		case "extra-visitor-state-id":
			return "extra_visitor_id";
		case "extra-visitor-email":
			return "extra_visitor ->> email";
		case "extra-visitor-phone-number":
			return "extra_visitor ->> phone_number";
		case "extra-visitor-familial-realtion":
			return "extra_visitor ->> relation";
		case "visit-creation-datetime":
			return "created_at";
	}
}
