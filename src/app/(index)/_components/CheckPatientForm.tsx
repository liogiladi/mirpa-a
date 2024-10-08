"use client";

import { Dispatch, useRef } from "react";
import formStyles from "./form.module.css";

import toast from "react-hot-toast";
import { checkPatient } from "@/server/actions";

import Button from "@/components/theme/Button";
import Input from "@/components/theme/Input";

type Props = {
	className?: string;
	setSelectedPatientCID: Dispatch<string>;
};

export default function CheckPatientForm({
	className,
	setSelectedPatientCID,
}: Props) {
	const ref = useRef<HTMLFormElement>(null);

	return (
		<form
			ref={ref}
			action={async (data) => {
				try {
					const error = await checkPatient(data);

					if (error) {
						toast.error(error);
					} else {
						setSelectedPatientCID(
							data.get("state-id")?.toString()!
						);
						ref.current?.reset();
					}
				} catch (error) {
					toast.error("תקלה באימות");
				}
			}}
			className={`${formStyles.form} ${className}`}
		>
			<legend>אימות זהות מטופל</legend>
			<Input
				id="state-id"
				type="number"
				label={"מס' זהות מטופל"}
				required
			/>
			<Button variant={"filled"} colorVariant="primary">
				המשך
			</Button>
		</form>
	);
}
