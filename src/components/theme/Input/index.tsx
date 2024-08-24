import {
	InputHTMLAttributes,
	memo,
	MouseEventHandler,
	useRef,
	useState,
} from "react";
import styles from "./input.module.scss";
import XIcon from "@/components/icons/XIcon";

type Props = {
	id: string;
	label: string;
	enableClearButton?: boolean;
	onClear?: MouseEventHandler<HTMLButtonElement>;
} & OmitProperties<InputHTMLAttributes<HTMLInputElement>, "id" | "onInput">;

export const INVALID_INPUT_DATA_KEY = "invalid";

export default memo(function Input({
	type = "text",
	id,
	label,
	className = "",
	enableClearButton = false,
	onClear,
	...props
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [showClearButton, setShowClearButton] = useState(false);

	return (
		<label htmlFor={id} key={id} className={`${styles.input} ${className}`}>
			<div className={styles["label-content"]}>
				{label}
				{props.required && <span className={styles.required}>*</span>}
			</div>
			<input
				ref={inputRef}
				id={id}
				name={id}
				placeholder="הזן כאן..."
				onInput={(e) => {
					e.currentTarget.setCustomValidity("");

					if (inputRef.current?.dataset[INVALID_INPUT_DATA_KEY]) {
						delete inputRef.current.dataset[INVALID_INPUT_DATA_KEY];
					}

					if (enableClearButton) {
						if (
							e.currentTarget.value.length > 0 &&
							!showClearButton
						)
							setShowClearButton(true);
						else if (
							e.currentTarget.value.length === 0 &&
							showClearButton
						)
							setShowClearButton(false);
					}
				}}
				hidden={type === "file"}
				type={type}
				{...props}
			/>
			{enableClearButton && (props.defaultValue || showClearButton) && (
				<button
					type="button"
					className={styles["clear-button"]}
					onClick={(e) => {
						e.preventDefault();
						inputRef.current!.value = "";
						delete inputRef.current?.dataset[
							INVALID_INPUT_DATA_KEY
						];
						setShowClearButton(false);
						onClear?.(e);
					}}
				>
					<XIcon />
				</button>
			)}
		</label>
	);
});
