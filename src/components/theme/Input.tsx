import {
	InputHTMLAttributes,
	memo,
	MouseEventHandler,
	useRef,
	useState,
} from "react";
import styles from "./input.module.scss";
import XIcon from "../icons/XIcon";

type Props = {
	id: string;
	label: string;
	enableClearButton?: boolean;
	onClear?: MouseEventHandler<HTMLButtonElement>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "onInput">;

export const INVALID_INPUT_DATA_KEY = "invalid";

export default memo(function Input({
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
			<input
				ref={inputRef}
				id={id}
				name={id}
				onInput={(e) => {
					if (enableClearButton) {
						if (e.currentTarget.value.length > 0 && !showClearButton)
							setShowClearButton(true);
						else if (e.currentTarget.value.length === 0 && showClearButton)
							setShowClearButton(false);
					}
				}}
				{...props}
			/>
			{enableClearButton && (props.defaultValue || showClearButton) && (
				<button
					className={styles["clear-button"]}
					onClick={(e) => {
						e.preventDefault();
						inputRef.current!.value = "";
						onClear?.(e);
						setShowClearButton(false);
					}}
				>
					<XIcon />
				</button>
			)}
		</label>
	);
});
