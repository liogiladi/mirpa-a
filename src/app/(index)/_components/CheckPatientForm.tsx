import { Dispatch } from "react";

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
	return (
		<form
			action={async (data) => {
				try {
					await checkPatient(data);
					setSelectedPatientCID(data.get("state-id")?.toString()!);
				} catch (error) {
					toast.error((error as Error).message);
				}
			}}
			className={className}
		>
			<legend>אימות זהות מטופל</legend>
			<Input
				id="state-id"
				type="number"
				label={"מס' ת.ז מטופל"}
				required
			/>
			<Button variant={"filled"} colorVariant="primary">
				המשך
			</Button>
		</form>
	);
}
