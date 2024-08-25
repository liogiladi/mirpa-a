"use client";

import { useRef } from "react";
import { v4 } from "uuid";

import styles from "./page.module.scss";
import visitPageStyles from "@/styles/visits-page.module.scss";

import { addPatient } from "@/server/actions";

import toast from "react-hot-toast";
import Validations from "@/utils/validations";
import { getDateString } from "@/utils/dates";
import { useDetectMobile } from "@/contexts/detectMobile";

import Input, { INVALID_INPUT_DATA_KEY } from "@/components/theme/Input";
import Button from "@/components/theme/Button";
import FileInput from "@/components/theme/FileInput";
import Signature from "@/components/theme/Signature";

export default function AddPatient() {
	const isMobile = useDetectMobile();
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
					try {
						const invalidInputsNames = await addPatient(
							signatureDataRef.current,
							data
						);

						if (invalidInputsNames.length > 0) {
							invalidInputsNames.forEach((name) => {
								const input =
									document.querySelector<HTMLInputElement>(
										`input[name=${name}]`
									);

								if (input) {
									input.dataset[INVALID_INPUT_DATA_KEY] =
										"true";
								}
							});

							toast.error("חלק מהשדות שהוזנו אינו תקין");
						}
					} catch (error) {
						if (!(error as Error).message) {
							//TODO: error page
						} else toast.error((error as Error).message);
					}
				}}
			>
				<section>
					<fieldset>
						<legend>פרטי מטופל</legend>
						<Input
							id={"first-name"}
							name={"first-name"}
							label={"שם פרטי"}
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
							max={getDateString(new Date())}
							required
						/>
						<FileInput
							id="profile-pic"
							name="profile-pic"
							label={"תמונה"}
							accept="image/*"
							maxFileSizeMB={3}
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
					<Button
						variant={isMobile ? "outline" : "filled"}
						colorVariant="primary"
					>
						הוספה
					</Button>
				</section>
			</form>
		</main>
	);
}
