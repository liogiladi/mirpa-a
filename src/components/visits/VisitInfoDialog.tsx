import { ReactEventHandler, useRef } from "react";
import styles from "./visit-info-dialog.module.scss";

import { JoinedVisit } from "@/utils/dbTypes";
import { getDateString, getTimeString } from "@/utils/dates";

import { useDetectMobile } from "@/contexts/detectMobile";

import Dialog from "@/components/Dialog";
import VisitMainInfo from "./VisitMainInfo";
import List from "../List";
import XIcon from "../icons/XIcon";

import { VisitType } from "./VisitRows";
import UpdateForm from "@/app/requested-visits/_components/UpdateForm";

type Props = {
	type: Exclude<VisitType, "requested">;
	visitInfo: JoinedVisit | null;
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

export default function VisitInfoDialog({ type, visitInfo, onClose }: Props) {
	const isMobile = useDetectMobile();
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
			<header>
				מידע על ביקור עתידי
				<button onClick={(_) => infoModalRef.current?.close()}>
					<XIcon />
				</button>
			</header>
			{visitInfo &&
				(isMobile ? (
					<List
						data={[
							"מספר ת.ז מבקר:",
							visitInfo.visitor_id,
							"טלפון מבקר:",
							visitInfo?.visitor?.phone_number,
							"דרגת קרבת מבקר:",
							visitInfo?.visitor?.relation,
							"אימייל מבקר:",
							visitInfo?.visitor?.email,
							...(visitInfo.extra_visitor
								? [
										"מספר ת.ז מבקר:",
										visitInfo.extra_visitor_id,
										"שם מבקר נוסף:",
										`${visitInfo.extra_visitor.first_name} ${visitInfo.extra_visitor.last_name}`,
										"דרגת קרבת מבקר נוסף:",
										visitInfo.extra_visitor.relation,
										"טלפון מבקר נוסף:",
										visitInfo.extra_visitor.phone_number,
										"טלפון מבקר נוסף:",
										visitInfo.extra_visitor.email,
								  ]
								: []),
							"תאריך יצירת הבקשה:",
							getDateString(creationDate, { format: true }),
							"זמן יצירת הבקשה:",
							getTimeString(creationDate),
							...(type === "requested-rejected"
								? ["סיבת דחייה", visitInfo.rejection_reason]
								: []),
						]}
					/>
				) : (
					<>
						<VisitMainInfo data={visitInfo} />
						<section>
							{infoToElement(
								"מספר ת.ז מבקר:",
								visitInfo.visitor_id
							)}
							{infoToElement(
								"טלפון מבקר:",
								visitInfo?.visitor?.phone_number
							)}
							{infoToElement(
								"דרגת קרבת מבקר:",
								visitInfo?.visitor?.relation
							)}
							{infoToElement(
								"אימייל מבקר:",
								visitInfo?.visitor?.email
							)}
							{visitInfo?.extra_visitor && (
								<>
									{infoToElement(
										"מספר ת.ז מבקר:",
										visitInfo.extra_visitor_id
									)}
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
							{infoToElement(
								"זמן יצירת הבקשה:",
								getTimeString(creationDate)
							)}
							{type === "requested-rejected" &&
								infoToElement(
									"סיבת דחייה:",
									visitInfo.rejection_reason
								)}
						</section>
					</>
				))}
			{type === "requested-pending" && visitInfo && (
				<UpdateForm
					visitId={visitInfo.id}
					closeDialog={() => infoModalRef.current?.close()}
				/>
			)}
		</Dialog>
	);
}
