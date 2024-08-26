import { useRef, useState } from "react";
import styles from "./update-form.module.scss";

import toast from "react-hot-toast";
import { approveRequest, rejectRequest } from "@/server/actions";
import { useDetectMobile } from "@/contexts/detectMobile";
import Validations from "@/utils/validations";

import Button from "@/components/theme/Button";
import Input, { INVALID_INPUT_DATA_KEY } from "@/components/theme/Input";

type Props = {
	visitId: string;
	closeDialog: () => void;
};

export default function UpdateForm({ visitId, closeDialog }: Props) {
	const isMobile = useDetectMobile();
	const [actionType, setActionType] = useState<"approve" | "reject">(
		"approve"
	);

	const rejectionFormRef = useRef<HTMLFormElement>(null);

	if (actionType === "approve") {
		return (
			<form
				id={styles["approve-form"]}
				action={async () => {
					try {
						await approveRequest(visitId);
					} catch (error) {
						toast.error((error as Error).message);
					}
				}}
				className={styles["update-form"]}
				onSubmit={() => closeDialog()}
			>
				<Button
					variant={isMobile ? "outline" : "filled"}
					colorVariant="primary"
				>
					אישור
				</Button>
				<Button
					type="button"
					variant={"outline"}
					colorVariant="warning"
					onClick={() => setActionType("reject")}
				>
					דחייה
				</Button>
			</form>
		);
	}

	return (
		<form
			ref={rejectionFormRef}
			id={styles["reject-form"]}
			action={async (data) => {
				try {
					await rejectRequest(visitId, data);
				} catch (error) {
					toast.error((error as Error).message);
				}
			}}
			className={styles["update-form"]}
			onSubmit={() => closeDialog()}
		>
			<section>
				<Button
					type="button"
					variant={"outline"}
					onClick={() => {
						setActionType("approve");
						rejectionFormRef.current?.reset();
					}}
				>
					ביטול
				</Button>
				<Button
					variant={isMobile ? "outline" : "filled"}
					colorVariant="warning"
				>
					אישור דחייה
				</Button>
			</section>
			<Input
				id={"rejection-reason"}
				name={"rejection-reason"}
				label={"סיבת דחייה"}
				required
				pattern={Validations.hebrewDescription.source}
				onInvalid={(e) => {
					e.currentTarget.setCustomValidity(
						"על הערך להכיל אותיות בעברית, מספרים, פסיקים ונקודות בלבד"
					);
					e.currentTarget.dataset[INVALID_INPUT_DATA_KEY] = "true";
				}}
				onChange={(e) => {
					e.target.setCustomValidity("");
					e.currentTarget.dataset[INVALID_INPUT_DATA_KEY] = "false";
				}}
			/>
		</form>
	);
}
