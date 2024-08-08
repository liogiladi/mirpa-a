import styles from "./visit-main-info.module.scss";

import { getDateString, getTimeString } from "@/utils/dates";
import { JoinedVisit } from "@/utils/dbTypes";

import CalanderIcon from "@/components/icons/CalanderIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import PatientIcon from "@/components/icons/PatientIcon";
import VisitorIcon from "@/components/icons/VisitorIcon";

type Props = {
	data: NonNullable<JoinedVisit>;
};

export default function VisitMainInfo({ data }: Props) {
	const date = new Date(data.datetime);

	return (
		<section className={styles["visit-main-info"]}>
			<div className={styles.item}>
				<PatientIcon />
				{`${data.patient!.first_name} ${data.patient!.last_name}`}
			</div>

			<div className={styles.item}>
				<VisitorIcon />
				{`${data.visitor!.first_name} ${data.visitor!.last_name}`}
			</div>

			<div className={styles.item}>
				<CalanderIcon />
				{getDateString(date, { format: true })}
			</div>

			<div className={styles.item}>
				<ClockIcon />
				{getTimeString(date)}
			</div>
		</section>
	);
}
