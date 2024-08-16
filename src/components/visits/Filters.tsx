"use client";

import {
	memo,
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

import Button from "@/components/theme/Button";
import Input, { INVALID_INPUT_DATA_KEY } from "@/components/theme/Input";
import Accordion from "@/components/theme/Accordion";
import PopoverForm, { PopoverSubmitHandler } from "../PopoverForm";

import { VisitType } from "./VisitRows";

type Props = {
	type: VisitType;
	data: Readonly<FilterIdToInfo<any>[]>;
};

export default memo(function Filters({ type, data: filtersData }: Props) {
	const router = useRouter();
	const currentSearchParams = useSearchParams();
	const [isFilterActive, setIsFilterActive] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);

	const filterParams = useMemo(
		() =>
			currentSearchParams
				.getAll(SEARCH_QUERIES.filters.name)
				.map(
					(stringifiedParam) =>
						JSON.parse(stringifiedParam) as [string, string]
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
				{Object.entries(info).map(([id, inputLabel], index) => {
					const isInputInfo = typeof inputLabel === "object";

					return (
						<Input
							tabIndex={index + 1}
							key={id}
							id={id}
							defaultValue={
								filterParams.find(([key]) => key === id)?.[1] ||
								undefined
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

	const applyFilters: PopoverSubmitHandler = (e, close) => {
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

		if (filtersQueries.length > 0 && !isFilterActive)
			setIsFilterActive(true);
		else if (filtersQueries.length === 0 && isFilterActive)
			setIsFilterActive(false);

		const params = new URLSearchParams(currentSearchParams);
		params.delete(SEARCH_QUERIES.filters.name);

		for (const filterQuery of filtersQueries) {
			params.append(
				SEARCH_QUERIES.filters.name,
				JSON.stringify(filterQuery)
			);
		}

		router.replace(`/${type}-visits?${params.toString()}`);
		close();
	};

	const clear: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
		if (!formRef.current) return;

		const inputs = formRef.current.querySelectorAll("input");
		inputs.forEach((input) => (input.value = ""));
	}, []);

	return (
		<PopoverForm
			ref={formRef}
			id={styles["filters-form"]}
			title={"סינון נתונים"}
			openingButtonOptions={{
				name: "סינון",
				extraHighlightCondition: isFilterActive,
			}}
			onSubmit={applyFilters}
			footerButtons={
				<>
					<Button variant="filled" colorVariant="primary">
						החל
					</Button>
					<Button type="button" variant="outline" onClick={clear}>
						נקה
					</Button>
				</>
			}
		>
			<section className={styles.accordions}>{accordions}</section>
		</PopoverForm>
	);
});
