import styles from "./visit-main-info.module.scss";

import CalanderIcon from "@/components/icons/CalanderIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import PatientIcon from "@/components/icons/PatientIcon";
import VisitorIcon from "@/components/icons/VisitorIcon";
import { getDateString, getTimeString } from "@/utils/dates";

import { UpcomingVisitRow } from "../page";

type Props = {
	data: NonNullable<UpcomingVisitRow>;
};

export default function VisitMainInfo({ data }: Props) {
	const date = new Date(data.datetime);

	return (
		<section className={styles["visit-main-info"]}>
			<div className={styles.item}>
				<PatientIcon />
				{`${data.patients!.first_name} ${data.patients!.last_name}`}
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
