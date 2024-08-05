"use client";

import { FormEventHandler, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./date-sort.module.scss";

import { getDateString } from "@/utils/dates";
import { SEARCH_QUERIES } from "@/utils/searchQueries";

import ToggleLinks from "@/components/ToggleLinks";
import Button from "@/components/theme/Button";

const specificDateUrlId = "specific-date";

export default function DateSort() {
	const router = useRouter();
	const specificDateFormRef = useRef<HTMLFormElement>(null);
	const radiosRef = useRef<HTMLFieldSetElement>(null);

	const submitSpecificDate: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		if (specificDateFormRef.current) {
			const formData = new FormData(specificDateFormRef.current);

			const params = new URLSearchParams();
			// params.append("urlId", specificDateUrlId);
			// params.append(
			// 	SEARCH_QUERIES.dateFilter.name,
			// 	String(formData.get("specific-date")?.valueOf())
			// );

			// router.replace(`/upcoming-visits?${params.toString()}`);
			// specificDateFormRef.current.dataset.open = "false";
		}
	};

	return (
		<div id={styles["date-sort"]}>
			<Button
				variant="outline"
				onClick={(e) => {
					if (specificDateFormRef.current) {
						specificDateFormRef.current.dataset.open = "true";
						specificDateFormRef.current.focus();
					}
				}}
			>
				מיון
			</Button>
			<form
				ref={specificDateFormRef}
				tabIndex={0}
				id={styles["sort-date-popup"]}
				data-open={false}
				onBlur={(e) => {
					if (
						specificDateFormRef.current &&
						(e.relatedTarget == null ||
							([
								e.relatedTarget,
								e.relatedTarget.parentElement,
							].every(
								(el) => el !== specificDateFormRef.current
							) &&
								[
									e.relatedTarget,
									e.relatedTarget.parentElement,
									e.relatedTarget.parentElement
										?.parentElement,
								].every((el) => el !== radiosRef.current)))
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
				<fieldset ref={radiosRef}>
					<label htmlFor="visit-datetime">
						<input type="radio" name="sort" id="visit-datetime" />
					</label>
					<label htmlFor="visit-creation-datetime">
						<input
							type="radio"
							name="sort"
							id="visit-creation-datetime"
						/>
					</label>
					<label htmlFor="patient-name">
						<input type="radio" name="sort" id="patient-name" />
					</label>
					<label htmlFor="visitor-name">
						<input type="radio" name="sort" id="visitor-name" />
					</label>
				</fieldset>
				<Button variant="outline" colorVariant="primary">
					החל
				</Button>
			</form>
		</div>
	);
}
