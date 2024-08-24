import { ChangeEvent, HTMLProps, useState } from "react";
import styles from "./file-input.module.scss";
import Input from "../Input";

type Props = {
	id: string;
	label: string;
	onChange?(e: ChangeEvent<HTMLInputElement>): void;
} & OmitProperties<
	HTMLProps<HTMLInputElement>,
	"id" | "label" | "onChange" | "type" | "hidden"
>;

export default function FileInput({ id, label, onChange, ...props }: Props) {
	const [selectedFileName, setSelectedFileName] = useState("");

	return (
		<div className={styles["file-input"]}>
			<Input
				type="file"
				id={id}
				label={label}
				onChange={(e) => {
					const file = e.target.files?.[0];

					if (file) {
						setSelectedFileName(file.name);
					}

					onChange?.(e);
				}}
				hidden
				{...props}
			/>
			<label htmlFor={id}>{selectedFileName || "בחר קובץ"}</label>
		</div>
	);
}
