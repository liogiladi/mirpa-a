"use client";

import { memo } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/styles/links-filter.module.scss";

import {
	getUpdatedSearchParamsURL,
	SEARCH_QUERIES,
} from "@/utils/searchQueries";
import ToggleLinks from "@/components/theme/ToggleLinks";

export default memo(function StatusFilter() {
	const currentParams = useSearchParams();

	return (
		<div id={styles["links-filter"]}>
			<ToggleLinks
				activeAccuracy="pathname-searchparams"
				variant={"outline"}
				links={[
					{
						name: "בקשות חדשות",
						href: `/requested-visits?${getUpdatedSearchParamsURL(
							currentParams,
							(params) => {
								params.set(
									SEARCH_QUERIES.status.name,
									SEARCH_QUERIES.status.values[0]
								);
							}
						)}`,
					},
					{
						name: "בקשות שנדחו",
						href: `/requested-visits?${getUpdatedSearchParamsURL(
							currentParams,
							(params) => {
								params.set(
									SEARCH_QUERIES.status.name,
									SEARCH_QUERIES.status.values[1]
								);
							}
						)}`,
					},
				]}
			/>
		</div>
	);
});
