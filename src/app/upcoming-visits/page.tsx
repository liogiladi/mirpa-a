import assert from "assert";

import styles from "./upcoming-visits.module.scss";
import db from "@/server/db";

import { taintObj } from "@/utils/objects";
import { getDateString } from "@/utils/dates";

import DateFilter from "./_components/DateFilter";
import VisitRow from "@/app/upcoming-visits/_components/VisitRow";

import type { SearchQuery } from "@/utils/types";

type Props = {
	searchParams?: SearchQuery;
};

export const revalidate = 0;

export default async function UpcomingVisits({ searchParams }: Props) {
	assert(searchParams, "no search params");
	assert(searchParams.date, "no date search param");

	const dateFilter = String(searchParams.date || getDateString(new Date()));

	const { data: visits, error } = await db
		.from("visits")
		.select()
		.gte("datetime", dateFilter)
		.lt("datetime", getDateString(new Date(dateFilter), 1));

	if (error) throw error;

	const visitElements = (visits || []).map((visit) => (
		<VisitRow key={visit.id} data={taintObj(visit, ["id"])} />
	));

	return (
		<main id={styles["upcoming-visits-page"]}>
			<h1>ביקורים ל-{dateFilter.split("-").reverse().join("/")}</h1>
			<DateFilter />
			{visitElements}
		</main>
	);
}
