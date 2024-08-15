"use client";

import {
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
import { handleBlurOnOutsideClick } from "@/utils/dom";

import Button from "@/components/theme/Button";
import SortArrow from "@/components/icons/SortArrowIcon";

import { VisitType } from "./VisitRows";
import { isMobileCross } from "@/utils/mobile";

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
	const [orderDirection, setOrderDireection] =
		useState<OrderDirection>("ASC");

	useEffect(() => {
		const sort =
			currentSearchParams.get(SEARCH_QUERIES.sortBy.name)?.valueOf() ||
			"visit-datetime";

		const direction =
			currentSearchParams
				.get(SEARCH_QUERIES.orderDirection.name)
				?.valueOf() || "ASC";

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

	const isMobile = isMobileCross();

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
				onBlur={(e) =>
					handleBlurOnOutsideClick(e, () => {
						if (!isMobile) setIsFormOpen(false);
					})
				}
				onSubmit={submitSpecificDate}
			>
				{isMobile && <legend>מיון נתונים</legend>}
				<fieldset ref={fieldsetRef}>{radioButtons}</fieldset>
				<div id={styles.buttons}>
					<Button variant="filled" colorVariant="primary">
						החל
					</Button>
					{isMobile && <Button variant="outline">ביטול</Button>}
				</div>
				<button
					id={styles["sort-direction-button"]}
					style={{
						rotate: orderDirection === "ASC" ? "180deg" : "0deg",
					}}
					onClick={(e) => {
						e.preventDefault();
						setOrderDireection((prev) =>
							prev === "ASC" ? "DESC" : "ASC"
						);
					}}
				>
					<SortArrow />
				</button>
			</form>
		</div>
	);
});
