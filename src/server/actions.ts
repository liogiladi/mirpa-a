"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import assert from "assert";
import db from "@/server/db";
import Validations from "@/utils/validations";
import { dataURLtoFile } from "@/utils/dataURLToFile";

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
	let stoargeQuery = db.storage.from("pictures");

	const storagePathsToRemove: string[] = [];
	const cidsOrStatements: string[] = [];

	for (const cid of selectedPatientCIDs) {
		cidsOrStatements.push(`cid.eq.${cid}`);
		storagePathsToRemove.push(
			`patients-profiles/${cid}.png`,
			`user-signatures/${cid}.png`
		);
	}

	const { error } = await query.or(cidsOrStatements.join(","));

	if (error) {
		//TODO: Global log error
		throw error;
	}

	const { error: storageError } = await stoargeQuery.remove(
		storagePathsToRemove
	);

	if (storageError) {
		//TODO: Global log error
		console.log(storageError);

		throw storageError;
	}

	revalidatePath(headers().get("referer")!);
}

export async function addPatient(signatureBase64: string, formData: FormData) {
	const userId = formData.get("user-id")?.toString();
	assert(
		userId && Validations.uuid.test(userId),
		"מספר מזהה של מאשר לא תקין"
	);

	const signatureImageFile = signatureBase64
		? dataURLtoFile(signatureBase64, userId)
		: null;
	if (!signatureImageFile) throw new Error("יש להביא חתימה מאשרת");

	const firstName = formData.get("first-name")?.toString();
	assert(
		firstName && Validations.hebrewName.test(firstName),
		"שם פרטי לא תקין"
	);

	const lastName = formData.get("last-name")?.toString();
	assert(
		lastName && Validations.hebrewName.test(lastName),
		"שם משפחה לא תקין"
	);

	const cid = formData.get("state-id")?.toString();
	assert(cid && Validations.cid(cid), "מספר ת.ז לא תקין");

	const birthDate = formData.get("birth-date")?.toString();
	assert(birthDate && Validations.date(birthDate), "תאריך לידה לא תקין");

	const address = formData.get("address")?.toString() || null;
	assert(
		!address || (address && Validations.address.test(address)),
		"כתובת מגורים לא תקינה"
	);

	const profilePicFile: File | null =
		(formData.get("profile-pic")?.valueOf() as File) || null;

	let profilePicPath = null;

	if (profilePicFile.size > 0) {
		//TODO: Register profile pic to bucket
		profilePicPath = `patients-profiles/${cid}.png`;
		await db.storage
			.from("pictures")
			.upload(profilePicPath, profilePicFile);
	}

	//TODO: Register signature pic to bucket
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
			//TODO: Patient cid already regitered
			throw new Error("מטופל עם מספר ת.ז זה קיים במערכת");
		}

		//TODO: Global log error
		throw error;
	}

	redirect("/patients-management");
}
