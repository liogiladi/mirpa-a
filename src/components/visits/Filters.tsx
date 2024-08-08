"use client";

import {
	FormEventHandler,
	MouseEventHandler,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./filters.module.scss";

import { SEARCH_QUERIES } from "@/utils/searchQueries";
import { FilterIdToInfo, validateFormData } from "@/utils/filters";
import { handleBlurOnOutsideClick } from "@/utils/dom";

import Button from "@/components/theme/Button";
import Input, { INVALID_INPUT_DATA_KEY } from "@/components/theme/Input";
import Accordion from "@/components/theme/Accordion";

import { VisitType } from "./VisitRows";

type Props = {
	type: VisitType;
	data: Readonly<FilterIdToInfo<any>[]>;
};

export default function Filters({ type, data: filtersData }: Props) {
	const router = useRouter();
	const currentSearchParams = useSearchParams();

	const formRef = useRef<HTMLFormElement>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isFilterActive, setIsFilterActive] = useState(false);

	const filterParams = useMemo(
		() =>
			currentSearchParams
				.getAll(SEARCH_QUERIES.filters.name)
				.map(
					(stringifiedParam) => JSON.parse(stringifiedParam) as [string, string]
				),
		[currentSearchParams]
	);

	const accordions = useMemo(() => {
		return filtersData.map(({ accordionLabel, ...info }) => (
			<Accordion
				key={accordionLabel}
				label={accordionLabel!}
				contentClassName={styles["accordion-content"]}
			>
				{Object.entries(info).map(([id, inputLabel]) => {
					const isInputInfo = typeof inputLabel === "object";

					return (
						<Input
							key={id}
							id={id}
							defaultValue={
								filterParams.find(([key]) => key === id)?.[1] || undefined
							}
							placeholder={"הזן כאן..."}
							{...(isInputInfo ? inputLabel : {})}
							label={isInputInfo ? inputLabel.label : inputLabel}
							enableClearButton={true}
						/>
					);
				})}
			</Accordion>
		));
	}, [filterParams, filtersData]);

	const applyFilters: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		if (!formRef.current) return;

		const data = new FormData(formRef.current);
		const errors = validateFormData(filtersData, data);

		if (errors) {
			return errors.forEach((error, index) => {
				const invalidInput = document.querySelector<HTMLInputElement>(
					`input[name="${error.inputName}"]`
				);

				if (index === 0) {
					invalidInput?.parentElement?.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}

				invalidInput!.dataset[INVALID_INPUT_DATA_KEY] = "true";
			});
		}

		const filtersQueries = Array.from(data.entries()).reduce(
			(acc, [key, value]) => {
				value.valueOf() && acc.push([key, value.valueOf().toString()]);
				return acc;
			},
			[] as [string, string][]
		);

		if (filtersQueries.length > 0 && !isFilterActive) setIsFilterActive(true);
		else if (filtersQueries.length === 0 && isFilterActive)
			setIsFilterActive(false);

		const params = new URLSearchParams(currentSearchParams);
		params.delete(SEARCH_QUERIES.filters.name);

		for (const filterQuery of filtersQueries) {
			params.append(SEARCH_QUERIES.filters.name, JSON.stringify(filterQuery));
		}

		router.replace(`/${type}-visits?${params.toString()}`);
		setIsFormOpen(false);
	};

	const clear: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
		e.preventDefault();
		formRef.current?.reset();

		const params = new URLSearchParams(currentSearchParams);
		params.delete(SEARCH_QUERIES.filters.name);

		router.replace(`/upcoming-visits?${params.toString()}`);

		setIsFormOpen(false);
		setIsFilterActive(false);
	}, []);

	return (
		<div id={styles.filters}>
			<Button
				variant="outline"
				colorVariant={
					isFilterActive ? "primary" : isFormOpen ? "primary" : undefined
				}
				onClick={() => {
					if (formRef.current) {
						formRef.current.dataset.open = "true";
						formRef.current.focus();
						setIsFormOpen(true);
					}
				}}
			>
				סינון
			</Button>
			<form
				ref={formRef}
				tabIndex={0}
				id={styles["filters-date-popup"]}
				onSubmit={applyFilters}
				onBlur={(e) => handleBlurOnOutsideClick(e, () => setIsFormOpen(false))}
				data-open={isFormOpen}
			>
				<section className={styles.accordions}>{accordions}</section>
				<section className={styles.buttons}>
					<Button variant="filled" colorVariant="primary">
						החל
					</Button>
					<Button variant="outline" onClick={clear}>
						נקה
					</Button>
				</section>
			</form>
		</div>
	);
}
