import { useRef, useState } from "react";
import styles from "./update-form.module.scss";

import { approveRequest, rejectRequest } from "@/server/actions";
import { useDetectMobile } from "@/contexts/detectMobile";
import Validations from "@/utils/validations";

import Button from "@/components/theme/Button";
import Input from "@/components/theme/Input";

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
				action={approveRequest.bind(null, visitId)}
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
			action={rejectRequest.bind(null, visitId)}
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
				onInvalid={(e) =>
					e.currentTarget.setCustomValidity(
						"על הערך להכיל אותיות בעברית, רווחים ונקודות בלבד"
					)
				}
				onChange={(e) => e.target.setCustomValidity("")}
			/>
		</form>
	);
}
