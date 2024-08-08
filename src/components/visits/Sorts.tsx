"use client";

import {
	FocusEventHandler,
	FormEventHandler,
	memo,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./sorts.module.scss";

import { OrderDirection, SEARCH_QUERIES, Sort } from "@/utils/searchQueries";

import Button from "@/components/theme/Button";
import SortArrow from "@/components/icons/SortArrowIcon";

import { VisitType } from "./VisitRows";

const radioButtonInfos: Record<Sort, string> = {
	"visit-datetime": "זמן ביקור",
	"visit-creation-datetime": "זמן יצירת הבקשה",
	"patient-name": "שם המטופל",
	"visitor-name": "שם המבקר",
};

type Props = {
	type: VisitType;
};

export default memo(function Sorts({ type }: Props) {
	const sortsId = useId();

	const router = useRouter();
	const currentSearchParams = useSearchParams();

	const formRef = useRef<HTMLFormElement>(null);
	const fieldsetRef = useRef<HTMLFieldSetElement>(null);

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedSort, setSelectedSort] = useState<Sort>("visit-datetime");
	const [orderDirection, setOrderDireection] = useState<OrderDirection>("ASC");

	useEffect(() => {
		const sort =
			currentSearchParams.get(SEARCH_QUERIES.sortBy.name)?.valueOf() ||
			"visit-datetime";

		const direction =
			currentSearchParams.get(SEARCH_QUERIES.orderDirection.name)?.valueOf() ||
			"ASC";

		setSelectedSort(sort as Sort);
		setOrderDireection(direction as OrderDirection);
	}, [currentSearchParams]);

	const radioButtons = useMemo(
		() =>
			Object.entries(radioButtonInfos).map(([id, label]) => (
				<label key={id} htmlFor={`${sortsId}-${id}`}>
					<input
						type="radio"
						name="sort"
						id={`${sortsId}-${id}`}
						checked={selectedSort === id}
						onChange={() => setSelectedSort(id as Sort)}
					/>
					{label}
				</label>
			)),
		[selectedSort, sortsId]
	);

	const submitSpecificDate: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		if (!formRef.current) return;

		if (!selectedSort || !orderDirection) {
			return alert("invalid sort values");
		}

		const params = new URLSearchParams(currentSearchParams);
		params.delete(SEARCH_QUERIES.sortBy.name);
		params.delete(SEARCH_QUERIES.orderDirection.name);

		params.append(SEARCH_QUERIES.sortBy.name, selectedSort);
		params.append(SEARCH_QUERIES.orderDirection.name, orderDirection);

		router.replace(`/${type}-visits?${params.toString()}`);
		setIsFormOpen(false);
	};

	const blurForm: FocusEventHandler<HTMLFormElement> = (e) => {
		if (!formRef.current) return;

		// If user clicked out of form, and not on form's children, than close it
		if (
			e.relatedTarget !== e.currentTarget &&
			!e.currentTarget.contains(e.relatedTarget)
		) {
			setIsFormOpen(false);
		}
	};

	return (
		<div id={styles.sorts}>
			<Button
				variant="outline"
				colorVariant={isFormOpen ? "primary" : undefined}
				onClick={() => {
					if (formRef.current) {
						formRef.current.dataset.open = "true";
						formRef.current.focus();
						setIsFormOpen(true);
					}
				}}
			>
				מיון
			</Button>
			<form
				ref={formRef}
				tabIndex={0}
				id={styles["sort-date-popup"]}
				data-open={isFormOpen}
				onBlur={blurForm}
				onSubmit={submitSpecificDate}
			>
				<fieldset ref={fieldsetRef}>{radioButtons}</fieldset>
				<Button variant="outline" colorVariant="primary">
					החל
				</Button>
				<button
					id={styles["sort-direction-button"]}
					style={{
						rotate: orderDirection === "ASC" ? "180deg" : "0deg",
					}}
					onClick={(e) => {
						e.preventDefault();
						setOrderDireection((prev) => (prev === "ASC" ? "DESC" : "ASC"));
					}}
				>
					<SortArrow />
				</button>
			</form>
		</div>
	);
});
