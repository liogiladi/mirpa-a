"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import db from "@/server/db";
import Validations from "@/utils/validations";

export async function approveRequest(visitId: string) {
	if (!Validations.uuid.test(visitId)) {
		throw new Error("תקלה בעדכון");
	}

	const { error } = await db
		.from("visits")
		.update({ approved: true })
		.eq("id", visitId)
		.is("approved", null);

	if (error) {
		//TODO: Global log error
		throw error;
	}

	//TODO: Notify user

	revalidatePath(headers().get("referer")!);
}

export async function rejectRequest(visitId: string, formData: FormData) {
	if (!Validations.uuid.test(visitId)) {
		throw new Error("תקלה בעדכון");
	}

	const rejectionReason = formData.get("rejection-reason")?.toString();

	if (
		!rejectionReason ||
		!Validations.hebrewDescription.test(rejectionReason)
	) {
		throw new Error("סיבת דחייה לא תקינה");
	}

	const { error } = await db
		.from("visits")
		.update({ approved: false, rejection_reason: rejectionReason })
		.eq("id", visitId)
		.is("approved", null);

	if (error) {
		//TODO: Global log error
		throw error;
	}

	//TODO: Notify user

	revalidatePath(headers().get("referer")!);
}
