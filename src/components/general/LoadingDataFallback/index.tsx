import styles from "./loading-data-fallback.module.scss";

type Props = {};

export default function LoadingDataFallback({}: Props) {
	return (
		<div className={styles["loading-data-fallback"]}>
			<span />
			<span />
		</div>
	);
}
