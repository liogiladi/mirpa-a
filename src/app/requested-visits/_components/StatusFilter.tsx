import { memo } from "react";
import styles from "@/styles/links-filter.module.scss";
import ToggleLinks from "@/components/ToggleLinks";

export default memo(function StatusFilter() {
	return (
		<div id={styles["links-filter"]}>
			<ToggleLinks
				activeAccuracy="pathname-searchparams"
				variant={"outline"}
				links={[
					{
						name: "בקשות חדשות",
						href: "/requested-visits?status=pending",
					},
					{
						name: "בקשות שנדחו",
						href: "/requested-visits?status=rejected",
					},
				]}
			/>
		</div>
	);
});
