"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

import { useDetectMobile } from "@/contexts/detectMobile";

import LogoIcon from "@/components/icons/LogoIcon";
import CreateVisitForm from "./_components/CreateVisitForm";
import CheckPatientForm from "./_components/CheckPatientForm";

export default function Index() {
	const isMobile = useDetectMobile();
	const [shownSection, setShownSection] = useState<
		"hamal" | "hamal-full" | "family" | "family-full" | null
	>(null);

	const [selectedPatientCID, setSelectedPatientCID] = useState("");

	const router = useRouter();

	return (
		<main
			className="index"
			id={styles.index}
			onClick={(e) => {
				if (
					shownSection === "family-full" ||
					shownSection === "hamal-full"
				) {
					return;
				}

				setShownSection((prev) => {
					if (isMobile) {
						const ratio = e.clientX / window.innerWidth;

						if (ratio > (isMobile ? 0.5 : 0.65))
							return "family-full";
						if (ratio < (isMobile ? 0.5 : 0.4)) {
							setTimeout(() => {
								router.push("/about?transition=fade-in");
								router.refresh();
							}, 1000);

							return "hamal-full";
						}

						return null;
					} else if (prev === "hamal") {
						setTimeout(() => {
							router.push("/about?transition=fade-in");
							router.refresh();
						}, 1000);

						return "hamal-full";
					} else if (prev === "family") return "family-full";

					return null;
				});
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
					<CreateVisitForm
						selectedPatientCID={selectedPatientCID}
						setSelectedPatientCID={setSelectedPatientCID}
						setShownSection={setShownSection}
					/>
				)}
			</section>
		</main>
	);
}
