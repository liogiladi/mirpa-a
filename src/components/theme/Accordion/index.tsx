import { PropsWithChildren } from "react";
import AccordionArrowIcon from "@/components/icons/AccordionArrowIcon";
import styles from "./accordion.module.css";

type Props = {
	label: string;
	contentClassName?: string;
};

export default function Accordion({
	label,
	children,
	contentClassName = "",
}: PropsWithChildren<Props>) {
	return (
		<details className={styles.accordion}>
			<summary>
				{label}
				<AccordionArrowIcon />
			</summary>
			<div className={contentClassName}>{children}</div>
		</details>
	);
}
