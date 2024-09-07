import { memo, useId, useMemo } from "react";
import styles from "./list.module.css";

type Props = {
	data: (string | null | undefined)[];
};

export default memo(function List({ data }: Props) {
	const id = useId();

	const items = useMemo(
		() => data.map((item) => <li key={`${id}-${item}`}>{item || "-"}</li>),
		[data, id]
	);

	return <ul className={styles.list}>{items}</ul>;
});
