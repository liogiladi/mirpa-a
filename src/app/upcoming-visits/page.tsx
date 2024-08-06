import styles from "./upcoming-visits.module.scss";
import Visits from "@/server/visits";

import { getDateString } from "@/utils/dates";
import { OrderDirection, SEARCH_QUERIES, Sort } from "@/utils/searchQueries";
import { SearchQuery } from "@/utils/types";

import DateFilter from "./_components/DateFilter";
import VisitRows from "./_components/VisitRows";
import Button from "@/components/theme/Button";
import PrintForm from "./_components/PrintForm";
import DateSort from "./_components/Sorts";
import { Assertions } from "@/server/validations";

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

	const visits = await Visits.getAllFilteredUpcomingJoined({
		filters: {
			date: {
				value: dateFilter,
				range: dateRange,
			},
		},
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
					<Button variant="outline">סינון</Button>
					<DateSort />
				</div>
			</section>
			<VisitRows visits={visits || []} />
		</main>
	);
}
