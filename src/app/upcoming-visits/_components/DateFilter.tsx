"use client";

import { FormEventHandler, useRef } from "react";
import styles from "./date-filter.module.scss";

import { getDateString } from "@/utils/dates";
import { useRouter } from "next/navigation";

import ToggleLinks from "@/components/ToggleLinks";

const specificDateUrlId = "specific-date";

export default function DateFilter() {
	const router = useRouter();
	const specificDateFormRef = useRef<HTMLFormElement>(null);

	const submitSpecificDate: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		if (specificDateFormRef.current) {
			const formData = new FormData(specificDateFormRef.current);

			const params = new URLSearchParams();
			params.append("urlId", specificDateUrlId);
			params.append(
				"date",
				String(formData.get("specific-date")?.valueOf())
			);

			router.replace(`/upcoming-visits?${params.toString()}`);
			specificDateFormRef.current.dataset.open = "false";
		}
	};

	return (
		<div id={styles["date-filter"]}>
			<ToggleLinks
				activeAccuracy="pathname-searchparams"
				variant={"outline"}
				links={[
					{
						name: "הכל",
						href: `/upcoming-visits?date-filter-type=all`,
					},
					{
						name: "היום",
						href: `/upcoming-visits?date=${getDateString(
							new Date()
						)}`,
						extraActiveMatches: ["/upcoming-visits"],
					},
					{
						name: "מחר",
						href: `/upcoming-visits?date=${getDateString(
							new Date(),
							{ daysBuffer: 1 }
						)}`,
					},
					{
						name: "תאריך מסוים",
						urlId: specificDateUrlId,
						anchorExtraProps: {
							onClick: (e) => {
								e.preventDefault();

								if (specificDateFormRef.current) {
									specificDateFormRef.current.dataset.open =
										"true";
									specificDateFormRef.current.focus();
								}
							},
						},
					},
				]}
				clickCallback={(e) => {
					if (
						specificDateFormRef.current &&
						e.currentTarget.innerHTML !== "תאריך מסוים"
					) {
						specificDateFormRef.current.dataset.open = "false";
					}
				}}
			/>
			<form
				ref={specificDateFormRef}
				tabIndex={0}
				id={styles["specific-date-popup"]}
				data-open={false}
				onBlur={(e) => {
					if (
						specificDateFormRef.current &&
						e.relatedTarget == null
					) {
						specificDateFormRef.current.dataset.open = "false";
					} else {
						setTimeout(() => {
							router.refresh();
						}, 0);
					}
				}}
				onSubmit={submitSpecificDate}
			>
				<input
					type="date"
					name="specific-date"
					min={new Date().toISOString().slice(0, 10)}
					required
				/>
				<input type="submit" value="סנן" />
			</form>
		</div>
	);
}
