"use client";

import { memo } from "react";
import Button from "@/components/theme/Button";

export default memo(function PrintForm() {
	return (
		<Button
			variant="outline"
			colorVariant="primary"
			onClick={() => window.print()}
		>
			הדפסה
		</Button>
	);
});
