import { InputHTMLAttributes, MouseEventHandler, useRef } from "react";
import styles from "./input.module.scss";

type Props = {
	id: string;
	label: string;
	enableClearButton?: boolean;
	onClear?: MouseEventHandler<HTMLButtonElement>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export const INVALID_INPUT_DATA_KEY = "invalid";

export default function Input({
	id,
	label,
	className = "",
	enableClearButton = false,
	onClear,
	...props
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<label
			htmlFor={id}
			key={id}
			className={`${styles.input} ${className}`}
			onInput={() => {
				if (inputRef.current?.dataset[INVALID_INPUT_DATA_KEY]) {
					delete inputRef.current.dataset[INVALID_INPUT_DATA_KEY];
				}
			}}
		>
			{label}
			<input ref={inputRef} id={id} name={id} {...props} />
			{enableClearButton && (
				<button
					onClick={(e) => {
						inputRef.current!.value = "";
						onClear?.(e);
					}}
				>
					x
				</button>
			)}
		</label>
	);
}
