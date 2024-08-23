"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import db from "@/server/db";
import Validations from "@/utils/validations";
import { PatientInfoToDelete } from "@/app/patients-management/_components/PatientsForm";

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

export async function deletePatients(selectedPatientCIDs: string[]) {
	if (selectedPatientCIDs.length === 0) {
		throw new Error("לא נבחרו מטופלים למחיקה");
	}

	let query = db.from("patients").delete();

	for (const cid of selectedPatientCIDs) {
		query = query.or(`cid.eq.${cid}`);
	}

	const { error } = await query;

	if (error) {
		//TODO: Global log error
		throw error;
	}

	revalidatePath(headers().get("referer")!);
}
