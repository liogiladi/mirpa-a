import { ReactNode } from "react";

import Visits from "@/server/visits";

import { getDateString, getTimeString } from "@/utils/dates";
import { OrderDirection, SEARCH_QUERIES, Sort } from "@/utils/searchQueries";
import { SearchParams, TupleOfLength } from "@/utils/types";

import Printable from "@/components/general/Printable";
import PDFPage from "@/components/pdf/PDFPage";
import Table from "@/components/theme/Table";
import VisitRows from "@/components/visits/VisitRows";

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

	// Print content
	const tableRowsValues: TupleOfLength<ReactNode, 13>[] = visits.map(
		(visit, index) => {
			const date = new Date(visit.datetime);

			return [
				index + 1 + "",
				`${visit.patient!.first_name} ${visit.patient!.last_name}`,
				visit.patient_cid,
				`${visit.visitor!.first_name} ${visit.visitor!.last_name}`,
				visit.visitor_id,
				visit.visitor!.relation,
				visit.visitor!.phone_number,
				visit.visitor!.email,
				visit.extra_visitor
					? `${visit.extra_visitor.first_name} ${visit.extra_visitor.last_name}`
					: null,
				visit.extra_visitor_id,
				visit.extra_visitor?.relation || null,
				getDateString(date, { format: true }),
				getTimeString(date),
			];
		}
	);

	const dateString = dateFilter.split("-").reverse().join("/");

	const dateFilterType =
		searchParams[SEARCH_QUERIES.dateFilterType.name] ===
		SEARCH_QUERIES.dateFilterType.value
			? SEARCH_QUERIES.dateFilter.values.min
			: SEARCH_QUERIES.dateFilter.values.specific;

	const title = `ביקורים ${
		dateFilterType === SEARCH_QUERIES.dateFilter.values.min ? "מ" : "ל"
	}-${dateString}`;

	const printContent = (
		<PDFPage title={title}>
			<Table
				width={13}
				columns={[
					" ",
					"שם המטופל",
					"מס' זהות המטופל",
					"שם המבקר",
					"מס' זהות המבקר",
					"קרבת המבקר",
					"טלפון המבקר",
					"אימייל המבקר",
					"שם המבקר הנוסף",
					"מס' זהות המבקר הנוסף",
					"קרבת המבקר הנוסף",
					"תאריך הביקור",
					"שעת הביקור",
				]}
				rows={tableRowsValues}
			/>
		</PDFPage>
	);

	return (
		<>
			<VisitRows type="upcoming" visits={visits || []} />
			<Printable>{printContent}</Printable>
		</>
	);
}
