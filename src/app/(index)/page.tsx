"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

import LogoIcon from "@/components/icons/LogoIcon";
import CreateVisitForm from "./_components/CreateVisitForm";
import CheckPatientForm from "./_components/CheckPatientForm";

export default function Index() {
	const [shownSection, setShownSection] = useState<
		"hamal" | "hamal-full" | "family" | "family-full" | null
	>(null);

	const [selectedPatientCID, setSelectedPatientCID] = useState("");

	const router = useRouter();

	return (
		<main
			className="index"
			id={styles.index}
			onClick={() => {
				if (shownSection === "hamal") {
					setShownSection("hamal-full");

					setTimeout(() => {
						router.push("/about?transition=fade-in");
						router.refresh();
					}, 1200);
				} else if (shownSection === "family") {
					setShownSection("family-full");
				}
			}}
			onMouseMove={(e) => {
				if (shownSection?.includes("full")) return;

				setShownSection(() => {
					const ratio = e.clientX / window.innerWidth;

					if (ratio > 0.65) return "family";
					if (ratio < 0.4) return "hamal";
					return null;
				});
			}}
			data-shown-section={shownSection}
		>
			<section id={styles["left-side"]}>
				<LogoIcon />
			</section>
			<section id={styles["right-side"]}>
				<LogoIcon />
				<button
					disabled={shownSection !== "family-full"}
					onClick={() => {
						setShownSection(null);
						setSelectedPatientCID("");
					}}
				>
					חזרה
				</button>

				<CheckPatientForm
					className={selectedPatientCID ? styles.hide : ""}
					setSelectedPatientCID={setSelectedPatientCID}
				/>

				{selectedPatientCID && shownSection === "family-full" && (
					<CreateVisitForm selectedPatientCID={selectedPatientCID} />
				)}
			</section>
		</main>
	);
}
