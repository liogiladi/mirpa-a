import assert from "assert";

import styles from "./upcoming-visits.module.scss";
import Visits from "@/server/visits";

import { getDateString } from "@/utils/dates";
import { SEARCH_QUERIES } from "@/utils/searchQueries";
import { SearchQuery } from "@/utils/types";

import DateFilter from "./_components/DateFilter";
import VisitRows from "./_components/VisitRows";
import Button from "@/components/theme/Button";
import PrintForm from "./_components/PrintForm";

type Props = {
	searchParams?: SearchQuery;
};

export const revalidate = 0;

export default async function UpcomingVisits({ searchParams }: Props) {
	assert(searchParams, "no search params");
	assert(
		searchParams[SEARCH_QUERIES.dateFilterType.name] ===
			SEARCH_QUERIES.dateFilterType.value
			? true
			: searchParams[SEARCH_QUERIES.dateFilter.name],
		"no date search param"
	);

	const dateFilter = String(
		searchParams[SEARCH_QUERIES.dateFilter.name] ||
			getDateString(new Date())
	);

	const { data: visits, error } = await Visits.getAllFilteredUpcomingJoined(
		dateFilter,
		searchParams[SEARCH_QUERIES.dateFilterType.name] ===
			SEARCH_QUERIES.dateFilterType.value
			? SEARCH_QUERIES.dateFilter.values.min
			: SEARCH_QUERIES.dateFilter.values.specific
	);

	if (error) throw error;

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
			<section id={styles["buttons"]}>
				<div>
					<PrintForm />
				</div>
				<div>
					<Button variant="outline">סינון</Button>
					<Button variant="outline">מיון</Button>
				</div>
			</section>
			<VisitRows visits={visits || []} />
		</main>
	);
}
