import assert from "assert";

import styles from "./upcoming-visits.module.scss";
import db from "@/server/db";

import { getDateString } from "@/utils/dates";

import DateFilter from "./_components/DateFilter";
import VisitRows from "./_components/VisitRows";

import type { SearchQuery } from "@/utils/types";

type Props = {
	searchParams?: SearchQuery;
};

function selectJoinedVisits(
	dateFilter: string,
	dateFilterType: "specific" | "min" = "specific"
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
		query = query.lt(
			"datetime",
			getDateString(new Date(dateFilter), { daysBuffer: 1 })
		);
	}

	return query;
}

export type UpcomingVisitRow =
	| NonNullable<
			Awaited<ReturnType<typeof selectJoinedVisits>>["data"]
	  >[number]
	| null;

export const revalidate = 0;

export default async function UpcomingVisits({ searchParams }: Props) {
	assert(searchParams, "no search params");
	assert(
		searchParams["date-filter-type"] === "all" ? true : searchParams.date,
		"no date search param"
	);

	const dateFilter = String(searchParams.date || getDateString(new Date()));

	const { data: visits, error } = await selectJoinedVisits(
		dateFilter,
		searchParams["date-filter-type"] === "all" ? "min" : "specific"
	);

	if (error) throw error;

	return (
		<main id={styles["upcoming-visits-page"]}>
			<h1>
				{searchParams.date
					? `ביקורים ל-${getDateString(
							new Date(String(searchParams.date)),
							{ format: true }
					  )}`
					: `ביקורים מ-${getDateString(new Date(), {
							format: true,
					  })}`}
			</h1>
			<DateFilter />
			<VisitRows visits={visits || []} />
		</main>
	);
}
