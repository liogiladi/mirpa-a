"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import db from "@/server/db";
import Validations from "@/utils/validations";
import { dataURLtoFile } from "@/utils/dataURLToFile";
import { assertCallback } from "@/utils/assertCallback";

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
		throw new Error("תקלה בעדכון");
	}

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
		throw new Error(
			"סיבת הסירוב יכולה להכיל רק: אותיות בעברית, מספרים, פסיקים ונקודות"
		);
	}

	const { error } = await db
		.from("visits")
		.update({ approved: false, rejection_reason: rejectionReason })
		.eq("id", visitId)
		.is("approved", null);

	if (error) {
		throw new Error("תקלה בעדכון");
	}

	revalidatePath(headers().get("referer")!);
}

export async function deletePatients(selectedPatientCIDs: string[]) {
	if (selectedPatientCIDs.length === 0) {
		throw new Error("לא נבחרו מטופלים למחיקה");
	}

	let query = db.from("patients").delete();
	let stoargeQuery = db.storage.from("pictures");

	const storagePathsToRemove: string[] = [];
	const cidsOrStatements: string[] = [];

	for (const cid of selectedPatientCIDs) {
		if (!Validations.cid(cid)) {
			throw new Error("תקלה במחיקה");
		}

		cidsOrStatements.push(`cid.eq.${cid}`);
		storagePathsToRemove.push(
			`patients-profiles/${cid}.png`,
			`user-signatures/${cid}.png`
		);
	}

	const { error: storageError } = await stoargeQuery.remove(
		storagePathsToRemove
	);

	if (storageError) {
		throw new Error("תקלה בהעלאת תמונה");
	}

	const { error } = await query.or(cidsOrStatements.join(","));

	if (error) {
		throw new Error("תקלה במחיקה");
	}

	revalidatePath(headers().get("referer")!);
}

export async function addPatient(
	signatureBase64: string,
	formData: FormData
): Promise<string[]> {
	const invalidInputsNames: string[] = [];

	const userId = formData.get("user-id")?.toString();
	if (!userId || !Validations.uuid.test(userId)) {
		throw new Error("תקלה בהוספה");
	}

	const signatureImageFile = signatureBase64
		? dataURLtoFile(signatureBase64, userId)
		: null;
	if (!signatureImageFile) throw new Error("יש להביא חתימה מאשרת");

	const firstName = formData.get("first-name")?.toString();
	assertCallback(firstName && Validations.hebrewName.test(firstName), () =>
		invalidInputsNames.push("first-name")
	);

	const lastName = formData.get("last-name")?.toString();
	assertCallback(lastName && Validations.hebrewName.test(lastName), () =>
		invalidInputsNames.push("last-name")
	);

	const cid = formData.get("state-id")?.toString();
	assertCallback(cid && Validations.cid(cid), () =>
		invalidInputsNames.push("state-id")
	);

	const birthDate = formData.get("birth-date")?.toString();
	assertCallback(birthDate && Validations.date(birthDate), () =>
		invalidInputsNames.push("birth-date")
	);

	const address = formData.get("address")?.toString() || null;
	assertCallback(
		!address || (address && Validations.address.test(address)),
		() => invalidInputsNames.push("address")
	);

	const profilePicFile: File | null =
		(formData.get("profile-pic")?.valueOf() as File) || null;

	if (profilePicFile && profilePicFile.size > 1024 * 1024 * 3) {
		throw new Error('גודל קובץ לא יכול לעלות על 10 מ"ב');
	}

	let profilePicPath = null;

	if (invalidInputsNames.length > 0) {
		return invalidInputsNames;
	}

	if (profilePicFile.size > 0) {
		profilePicPath = `patients-profiles/${cid}.png`;
		await db.storage
			.from("pictures")
			.upload(profilePicPath, profilePicFile);
	}

	const signatureImagePath = `user-signatures/${cid}.png`;
	await db.storage
		.from("pictures")
		.upload(signatureImagePath, signatureImageFile);

	const { error } = await db.from("patients").insert({
		cid,
		first_name: firstName,
		last_name: lastName,
		created_at: new Date().toDateString(),
		receiver_id: userId,
		birth_date: birthDate,
		address,
		profile_img_bucket_path: profilePicPath,
		reciever_signature_img_bucket_path: signatureImagePath,
	});

	if (error) {
		if (error.code === "23505") {
			// Patient cid already regitered
			throw new Error("מטופל עם מספר ת.ז זה קיים במערכת");
		}

		throw new Error("תקלה בהוספה");
	}

	redirect("/patients-management");
}
