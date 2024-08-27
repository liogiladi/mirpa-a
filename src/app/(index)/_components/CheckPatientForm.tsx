import { Dispatch, useEffect, useRef } from "react";
import formStyles from "./form.module.scss";

import toast from "react-hot-toast";
import { checkPatient } from "@/server/actions";

import Button from "@/components/theme/Button";
import Input from "@/components/theme/Input";

type Props = {
	className?: string;
	selectedPatientCID: string;
	setSelectedPatientCID: Dispatch<string>;
};

export default function CheckPatientForm({
	className,
	selectedPatientCID,
	setSelectedPatientCID,
}: Props) {
	const ref = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (!selectedPatientCID) {
			ref.current?.reset();
		}
	}, [selectedPatientCID]);

	return (
		<form
			ref={ref}
			action={async (data) => {
				try {
					await checkPatient(data);
					setSelectedPatientCID(data.get("state-id")?.toString()!);
				} catch (error) {
					toast.error((error as Error).message);
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
