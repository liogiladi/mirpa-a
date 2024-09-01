"use client";

import { createPortal } from "react-dom";
import styles from "./printable.module.scss";
import useMounted from "@/hooks/useMounted";

export default function Printable({
	children,
	portal = true,
}: PropsWithRequiredChildren<{ portal?: boolean }>) {
	const mounted = useMounted();

	if (!mounted) return null;

	if (portal) {
		return createPortal(
			<div className={styles.printable}>{children}</div>,
			document.body
		);
	}

	return <div className={styles.printable}>{children}</div>;
}
