import type { Metadata } from "next";
import styles from "./about.module.scss";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = {
	title: `משל"ט ביקורים | אודות`,
	description: "תיאור התכלית של משלט ביקורים",
};

type Props = {};

export default function index({}: Props) {
	return (
		<main id={styles["about-page"]}>
			<PageHeading>אודות</PageHeading>
			<p>
				<strong>
					* האתר, תכליתו והמידע השמור בו פיקטיביים לחלוטין *
				</strong>
			</p>
			<p>
				האתר משמש את צוות המרפאה ובאמצעותו ניתן לנהל ביקורים עבור
				מטופלים, שהוזמנו דרך אתר המבקרים הראשי של המרפאה.
			</p>

			<ul>
				<li>
					<span>באמצעות האתר ניתן:</span>
					<ul>
						<li>לנהל קליטה ושחרור של מטופלים.</li>
						<li>בקרה על בקשות ביקור, אישורן וסירובן.</li>
						<li>
							מעקב על ביקורים עתידיים - זמנים, מידע ואמצעי תקשרות
							עם המבקרים וכו’.
						</li>
						<li>הדפסת ביקורים עתידיים לצורך בקרה.</li>
						<li>
							להגיב ליצירת קשר של משתמשים - דרך מסרון או אימייל
							שניתנו באתר המבקרים הראשי.
						</li>
					</ul>
				</li>
				<li>
					<span>על זמינות המידע באתר:</span>
					<ul>
						<li>
							המידע באתר מאותחל כל בוקר למידע סטטי קבוע מראש, על
							מנת להקל על גודל מסד הנתונים.
						</li>
					</ul>
				</li>
			</ul>
		</main>
	);
}
