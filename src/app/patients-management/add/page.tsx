"use client";

import styles from "./page.module.scss";
import visitPageStyles from "@/styles/visits-page.module.scss";

import Input from "@/components/theme/Input";
import Button from "@/components/theme/Button";
import FileInput from "@/components/theme/FileInput";

type Props = {};

export default function AddPatient({}: Props) {
	return (
		<main id={styles["add-patient"]}>
			<h1>ניהול מטופלים</h1>
			<header>
				<button onClick={() => window.history.back()}>{">"}</button>
				<h2>קליטת מטופל</h2>
			</header>
			<form>
				<section>
					<fieldset>
						<legend>פרטי מטופל</legend>
						<Input id={"first-name"} label={"שם פרטי"} required />
						<Input id={"last-name"} label={"שם משפחה"} required />
						<Input
							type="number"
							id={"state-id"}
							label={"מספר ת.ז"}
							required
						/>
						<Input
							type="date"
							id={"birth-date"}
							label={"תאריך לידה"}
							required
						/>
						<FileInput
							id="profile-pic"
							label={"תמונה"}
							accept="image/*"
						/>
						<Input id={"address"} label={"כתובת מגורים"} />
					</fieldset>
					<fieldset>
						<legend>פרטי קולט</legend>
						<Input id={"user-id"} label={"מספר מזהה"} disabled />
						{/** TODO: Signature */}
					</fieldset>
				</section>
				<section className={visitPageStyles.buttons}>
					<Button variant={"filled"} colorVariant="primary">
						הוספה
					</Button>
				</section>
			</form>
		</main>
	);
}
