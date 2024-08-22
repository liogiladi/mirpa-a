import { useRef, useState } from "react";
import styles from "./update-form.module.scss";

import { approveRequest, rejectRequest } from "../_actions/updates";
import { useDetectMobile } from "@/contexts/detectMobile";

import Button from "@/components/theme/Button";
import Input from "@/components/theme/Input";
import Validations from "@/utils/validations";

type Props = {
	visitId: string;
};

export default function UpdateForm({ visitId }: Props) {
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
				onSubmit={(e) => e.preventDefault()}
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
					סירוב
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
			onSubmit={(e) => e.preventDefault()}
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
					אישור סירוב
				</Button>
			</section>
			<Input
				id={"rejection-reason"}
				label={"סיבת סירוב"}
				required
				pattern={Validations.hebrew.toString()}
				onInvalid={(e) =>
					e.currentTarget.setCustomValidity(
						"על הערך להכיל אותיות בעברית, רווחים ונקודות בלבד"
					)
				}
			/>
		</form>
	);
}
