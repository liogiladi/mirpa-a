import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./button.module.scss";

type Props = {
	variant: "filled" | "outline";
	colorVariant?: "primary" | "warning";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
	variant,
	colorVariant,
	className = "",
	children,
	...props
}: PropsWithChildren<Props>) {
	return (
		<button
			className={`${styles.button} ${className} ${
				colorVariant ? styles[colorVariant] : ""
			}`}
			{...props}
			data-variant={variant}
		>
			{children}
		</button>
	);
}
