"use client";

import { FormEventHandler, memo } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/theme/Button";

export default memo(function PrintForm() {
	const searchParams = useSearchParams();

	const submit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		window.open(`/upcoming-visits/print?${searchParams.toString()}`);
	};

	return (
		<form onSubmit={submit}>
			<Button variant="outline" colorVariant="primary">
				הדפסה
			</Button>
		</form>
	);
});
