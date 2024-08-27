import { memo, SelectHTMLAttributes, useMemo, useRef } from "react";
import styles from "./select.module.scss";

import { INVALID_INPUT_DATA_KEY } from "../Input";

type Props = {
	id: string;
	label: string;
	options: [label: string, value: string][];
} & OmitProperties<SelectHTMLAttributes<HTMLSelectElement>, "id">;

export default memo(function Select({
	id,
	label,
	options,
	className = "",
	...props
}: Props) {
	const selectRef = useRef<HTMLSelectElement>(null);

	const optionElements = useMemo(
		() =>
			options.map((option) => (
				<option key={`${id}-${option[0]}`} value={option[1]}>
					{option[0]}
				</option>
			)),
		[id, options]
	);

	return (
		<label htmlFor={id} className={styles.select}>
			<div className={styles["label-content"]}>
				{label}
				{props.required && <span className={styles.required}>*</span>}
			</div>

			<select
				ref={selectRef}
				id={id}
				{...props}
				onChange={(e) => {
					if (selectRef.current) {
						selectRef.current.dataset[INVALID_INPUT_DATA_KEY] =
							"false";
					}

					props.onChange?.(e);
				}}
			>
				<option disabled={props.required}>בחר כאן</option>
				{optionElements}
			</select>
		</label>
	);
});
