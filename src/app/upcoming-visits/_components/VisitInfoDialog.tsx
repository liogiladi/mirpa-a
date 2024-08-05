import { ReactEventHandler, useRef } from "react";
import styles from "./visit-info-dialog.module.scss";

import { UpcomingVisitRow } from "@/server/visits";

import Dialog from "@/components/Dialog";
import VisitMainInfo from "./VisitMainInfo";
import { getDateString, getTimeString } from "@/utils/dates";

type Props = {
	visitInfo: UpcomingVisitRow;
	onClose?: ReactEventHandler<HTMLDialogElement>;
};

function infoToElement(label: string, value: string | null | undefined) {
	if (!value) return;

	return (
		<div className={styles["info-item"]}>
			<span>{label}</span>
			{value}
		</div>
	);
}

export default function VisitInfoDialog({ visitInfo, onClose }: Props) {
	const infoModalRef = useRef<HTMLDialogElement>(null);

	const creationDate = visitInfo?.datetime
		? new Date(visitInfo?.created_at)
		: new Date(-1);

	if (visitInfo) {
		infoModalRef.current?.showModal();
	}

	return (
		<Dialog
			dialogRef={infoModalRef}
			closeOnBackdropClick={true}
			onClose={onClose}
			className={styles["visit-info-dialog"]}
		>
			<header>מידע על ביקור עתידי</header>
			{visitInfo && <VisitMainInfo data={visitInfo} />}
			<section>
				{infoToElement("טלפון מבקר:", visitInfo?.visitor?.phone_number)}
				{infoToElement("דרגת קרבת מבקר:", visitInfo?.visitor?.relation)}
				{infoToElement("אימייל מבקר:", visitInfo?.visitor?.email)}
				{visitInfo?.extra_visitor && (
					<>
						{infoToElement(
							"שם מבקר נוסף:",
							`${visitInfo.extra_visitor.first_name} ${visitInfo.extra_visitor.last_name}`
						)}
						{infoToElement(
							"דרגת קרבת מבקר נוסף:",
							visitInfo.extra_visitor.relation
						)}
						{infoToElement(
							"טלפון מבקר נוסף:",
							visitInfo.extra_visitor.phone_number
						)}
						{infoToElement(
							"טלפון מבקר נוסף:",
							visitInfo.extra_visitor.email
						)}
					</>
				)}
				{infoToElement(
					"תאריך יצירת הבקשה:",
					getDateString(creationDate, { format: true })
				)}
				{infoToElement("זמן יצירת הבקשה:", getTimeString(creationDate))}
			</section>
		</Dialog>
	);
}
