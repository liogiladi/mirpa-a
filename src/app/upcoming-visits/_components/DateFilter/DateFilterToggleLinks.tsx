"use client";

import { memo, RefObject } from "react";
import { useSearchParams } from "next/navigation";

import { getDateString } from "@/utils/dates";
import {
	getUpdatedSearchParamsURL,
	SEARCH_QUERIES,
} from "@/utils/searchQueries";

import { useDetectMobile } from "@/contexts/detectMobile";
import ToggleLinks from "@/components/theme/ToggleLinks";

type Props = {
	specificDateUrlId: string;
	specificDateFormRef: RefObject<HTMLFormElement>;
};

export default memo(function DateFilterToggleLinks({
	specificDateUrlId,
	specificDateFormRef,
}: Props) {
	const isMobile = useDetectMobile();
	const currentParams = useSearchParams();

	const currentDateQueryParam = currentParams.get(
		SEARCH_QUERIES.dateFilter.name
	);

	const specificDateLabel =
		isMobile &&
		currentParams.get(SEARCH_QUERIES.toggleLinkActive.name) &&
		currentDateQueryParam
			? getDateString(new Date(currentDateQueryParam), {
					format: true,
			  })
			: "תאריך מסוים";

	return (
		<ToggleLinks
			activeAccuracy="pathname-searchparams"
			variant={"outline"}
			links={[
				{
					name: "הכל",
					href: `/upcoming-visits?${getUpdatedSearchParamsURL(
						currentParams,
						(params) => {
							params.delete(SEARCH_QUERIES.dateFilter.name);
							params.delete(SEARCH_QUERIES.toggleLinkActive.name);
							params.set(
								SEARCH_QUERIES.dateFilterType.name,
								SEARCH_QUERIES.dateFilterType.value
							);
						}
					)}`,
				},
				{
					name: "היום",
					href: `/upcoming-visits?${getUpdatedSearchParamsURL(
						currentParams,
						(params) => {
							params.delete(SEARCH_QUERIES.dateFilterType.name);
							params.delete(SEARCH_QUERIES.toggleLinkActive.name);
							params.set(
								SEARCH_QUERIES.dateFilter.name,
								getDateString(new Date())
							);
						}
					)}`,
					extraActiveMatches: ["/upcoming-visits"],
				},
				{
					name: "מחר",
					href: `/upcoming-visits?${getUpdatedSearchParamsURL(
						currentParams,
						(params) => {
							params.delete(SEARCH_QUERIES.dateFilterType.name);
							params.delete(SEARCH_QUERIES.toggleLinkActive.name);
							params.set(
								SEARCH_QUERIES.dateFilter.name,
								getDateString(new Date(), { daysBuffer: 1 })
							);
						}
					)}`,
				},
				{
					name: specificDateLabel,
					urlId: specificDateUrlId,
					anchorExtraProps: {
						onClick: (e) => {
							e.preventDefault();

							if (specificDateFormRef.current) {
								specificDateFormRef.current.setAttribute(
									"data-open",
									"true"
								);
								specificDateFormRef.current.focus();
							}
						},
					},
				},
			]}
			clickCallback={(e) => {
				if (
					specificDateFormRef.current &&
					e.currentTarget.innerHTML !== specificDateLabel
				) {
					specificDateFormRef.current.dataset.open = "false";
				}
			}}
		/>
	);
});
