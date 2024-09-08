"use client";

import styles from "@/styles/not-found.module.css";

export default function GlobalError() {
	return (
		<main id={styles["not-found"]}>
			<section>
				<h1>404</h1>
				<h2>העמוד לא קיים</h2>
			</section>
		</main>
	);
}
