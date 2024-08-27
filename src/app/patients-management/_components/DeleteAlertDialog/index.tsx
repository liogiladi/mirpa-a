import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import styles from "./delete-alert-dialog.module.scss";

import Dialog from "@/components/theme/Dialog";
import { PatientInfoToDelete } from "../PatientsForm";
import Button from "@/components/theme/Button";

type Props = {
	patientsInfosToDelete: Map<string, PatientInfoToDelete>;
};

export default forwardRef<HTMLDialogElement, Props>(function DeleteAlertDialog(
	{ patientsInfosToDelete },
	ref
) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const infos = useMemo(
		() =>
			Array.from(patientsInfosToDelete.entries()).map(([cid, name]) => (
				<p
					key={cid}
				>{`${cid} - ${name.first_name} ${name.last_name}`}</p>
			)),
		[patientsInfosToDelete]
	);

	useImperativeHandle(ref, () => dialogRef.current!, []);

	return (
		<Dialog
			id={styles["delete-alert-dialog"]}
			dialogRef={dialogRef}
			closeOnBackdropClick={false}
		>
			<header>אישור מחיקת מטופל(ים)</header>
			<section>
				האם ברצונך למחוק את המטופלים הבאים:
				<section>{infos}</section>
				<strong>
					{`!הפעולה תמחק כל ביקור/בקשה שמקושרים למטופל(ים) הנ"ל`}
				</strong>
			</section>
			<footer>
				<Button
					type={"button"}
					variant={"outline"}
					onClick={() => dialogRef.current?.close()}
				>
					ביטול
				</Button>
				<Button type="submit" variant={"filled"} colorVariant="warning">
					אישור
				</Button>
			</footer>
		</Dialog>
	);
});
