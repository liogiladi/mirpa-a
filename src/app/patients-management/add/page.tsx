"use client";

import { useRef } from "react";
import { v4 } from "uuid";

import styles from "./page.module.scss";
import visitPageStyles from "@/styles/visits-page.module.scss";

import { addPatient } from "@/server/actions";

import Validations from "@/utils/validations";
import Input from "@/components/theme/Input";
import Button from "@/components/theme/Button";
import FileInput from "@/components/theme/FileInput";
import Signature from "@/components/theme/Signature";

export default function AddPatient() {
	const signatureDataRef = useRef<string>("");

	const userId = v4();

	return (
		<main id={styles["add-patient"]}>
			<h1>ניהול מטופלים</h1>
			<header>
				<button onClick={() => window.history.back()}>{">"}</button>
				<h2>קליטת מטופל</h2>
			</header>
			<form
				action={async (data) => {
					await addPatient(signatureDataRef.current, data);
				}}
			>
				<section>
					<fieldset>
						<legend>פרטי מטופל</legend>
						<Input
							id={"first-name"}
							name={"first-name"}
							label={"שם פרטי"}
							pattern={Validations.hebrewName.source}
							required
						/>
						<Input
							id={"last-name"}
							name={"last-name"}
							label={"שם משפחה"}
							pattern={Validations.hebrewName.source}
							required
						/>
						<Input
							type="number"
							id={"state-id"}
							name={"state-id"}
							label={"מספר ת.ז"}
							required
						/>
						<Input
							type="date"
							id={"birth-date"}
							name={"birth-date"}
							label={"תאריך לידה"}
							required
						/>
						<FileInput
							id="profile-pic"
							name="profile-pic"
							label={"תמונה"}
							accept="image/*"
						/>
						<Input
							id={"address"}
							name={"address"}
							label={"כתובת מגורים"}
							pattern={Validations.address.source}
						/>
					</fieldset>
					<fieldset>
						<legend>פרטי קולט</legend>
						<Input
							id={"user-id"}
							name={"user-id"}
							label={"מספר מזהה"}
							value={userId}
							readOnly
						/>
						<Signature
							id={"signature"}
							label={"חתימה מאשרת"}
							required
							outputRef={signatureDataRef}
						/>
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
