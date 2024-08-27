"use client";

import { Dispatch, SetStateAction, useRef } from "react";
import { createVisit } from "@/server/actions";
import styles from "./create-visit-form.module.scss";
import formStyles from "../form.module.scss";

import toast from "react-hot-toast";
import { getDateString } from "@/utils/dates";
import { RELATIONS } from "@/utils/constants";

import Button from "@/components/theme/Button";
import Input, { INVALID_INPUT_DATA_KEY } from "@/components/theme/Input";
import Select from "@/components/theme/Select";

type Props = {
	selectedPatientCID: string;
	setSelectedPatientCID: Dispatch<string>;
	setShownSection: Dispatch<
		SetStateAction<"hamal" | "hamal-full" | "family" | "family-full" | null>
	>;
};

export default function CreateVisitForm({
	selectedPatientCID,
	setSelectedPatientCID,
	setShownSection,
}: Props) {
	const ref = useRef<HTMLFormElement>(null);

	return (
		<form
			ref={ref}
			id={styles["create-visit-form"]}
			className={formStyles.form}
			action={async (data) => {
				try {
					document
						.querySelectorAll("input")
						.forEach(
							(input) =>
								(input.dataset[INVALID_INPUT_DATA_KEY] =
									"false")
						);
					const invalidInputsNames = await createVisit(
						selectedPatientCID,
						data
					);

					if (invalidInputsNames && invalidInputsNames.length > 0) {
						invalidInputsNames.forEach((name, index) => {
							const input =
								document.querySelector<HTMLInputElement>(
									`[name=${name}]`
								);

							if (input) {
								if (index === 0) {
									input.scrollIntoView({
										behavior: "smooth",
									});
								}

								input.dataset[INVALID_INPUT_DATA_KEY] = "true";
							}
						});

						toast.error("חלק מהשדות שהוזנו אינו תקין");
					} else {
						toast.success("הבקשה נשלחה");

						setTimeout(() => {
							ref.current?.reset();
							setShownSection(null);
							setSelectedPatientCID("");
						}, 1000);
					}
				} catch (error) {
					if (!(error as Error).message) {
						toast.error("תקלה ביצירת הבקשה");
					} else toast.error((error as Error).message);
				}
			}}
		>
			<legend>קביעת ביקור</legend>
			<section>
				<fieldset>
					<legend>פרטי ביקור</legend>
					<Input
						id="visit-time"
						name="visit-time"
						label="זמן ביקור"
						type="datetime-local"
						required
						min={new Date(
							getDateString(new Date(), {
								daysBuffer: 1,
							})
						).toLocaleString("sv")}
					/>
				</fieldset>
				<fieldset>
					<legend>פרטי מבקר</legend>
					<Input
						id="visitor-state-id"
						name="visitor-state-id"
						label="מס' זהות"
						type="number"
						required
					/>
					<Input
						id="visitor-first-name"
						name="visitor-first-name"
						label="שם פרטי"
						required
					/>
					<Input
						id="visitor-last-name"
						name="visitor-last-name"
						label="שם משפחה"
						required
					/>
					<Input
						id="visitor-phone-number"
						name="visitor-phone-number"
						label="מס' טלפון"
						type="tel"
					/>
					<Input
						id="visitor-email"
						name="visitor-email"
						label="כתובת אימייל"
						type="email"
					/>
					<Select
						id={"visitor-relation"}
						name="visitor-relation"
						label={"קרבה"}
						options={RELATIONS.map((relation) => [
							relation,
							relation,
						])}
					/>
				</fieldset>

				<fieldset>
					<legend>פרטי מבקר נוסף</legend>
					<Input
						id="extra-visitor-state-id"
						name="extra-visitor-state-id"
						label="מס' זהות"
						type="number"
					/>
					<Input
						id="extra-visitor-first-name"
						name="extra-visitor-first-name"
						label="שם פרטי"
					/>
					<Input
						id="extra-visitor-last-name"
						name="extra-visitor-last-name"
						label="שם משפחה"
					/>
					<Select
						id={"extra-visitor-relation"}
						name="extra-visitor-relation"
						label={"קרבה"}
						options={RELATIONS.map((relation) => [
							relation,
							relation,
						])}
					/>
				</fieldset>
			</section>
			<Button variant={"filled"} colorVariant="primary">
				שליחה
			</Button>
		</form>
	);
}
