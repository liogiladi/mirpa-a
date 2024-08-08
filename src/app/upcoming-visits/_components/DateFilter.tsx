"use client";

import { FormEventHandler, memo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./date-filter.module.scss";

import { SEARCH_QUERIES } from "@/utils/searchQueries";
import Button from "@/components/theme/Button";
import DateFilterToggleLinks from "./DateFilterToggleLinks";
import { handleBlurOnOutsideClick } from "@/utils/dom";

const SPECIFIC_DATE_URL_ID = "specific-date";

export default memo(function DateFilter() {
	const router = useRouter();
	const currentParams = useSearchParams();
	const specificDateFormRef = useRef<HTMLFormElement>(null);

	const submitSpecificDate: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		if (specificDateFormRef.current) {
			const formData = new FormData(specificDateFormRef.current);

			const params = new URLSearchParams(currentParams);
			params.delete(SEARCH_QUERIES.dateFilterType.name);
			params.set(SEARCH_QUERIES.toggleLinkActive.name, SPECIFIC_DATE_URL_ID);
			params.set(
				SEARCH_QUERIES.dateFilter.name,
				String(formData.get("specific-date")?.valueOf())
			);

			router.replace(`/upcoming-visits?${params.toString()}`);
			specificDateFormRef.current.dataset.open = "false";
		}
	};

	return (
		<div id={styles["date-filter"]}>
			<DateFilterToggleLinks
				specificDateUrlId={SPECIFIC_DATE_URL_ID}
				specificDateFormRef={specificDateFormRef}
			/>
			<form
				ref={specificDateFormRef}
				tabIndex={0}
				id={styles["specific-date-popup"]}
				data-open={false}
				onBlur={(e) =>
					handleBlurOnOutsideClick(e, () => {
						e.currentTarget.dataset.open = "false";
					})
				}
				onSubmit={submitSpecificDate}
			>
				<input
					type="date"
					name="specific-date"
					min={new Date().toISOString().slice(0, 10)}
					required
				/>
				<Button variant="outline" colorVariant="primary">
					החל
				</Button>
			</form>
		</div>
	);
});
