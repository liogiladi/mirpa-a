"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import assert from "assert";
import db from "@/server/db";

import Validations from "@/utils/validations";
import { dataURLtoFile } from "@/utils/dataURLToFile";
import { assertCallback } from "@/utils/assertCallback";
import { RELATIONS } from "@/utils/constants";

export async function approveRequest(visitId: string) {
	if (!Validations.uuid.test(visitId)) {
		console.error("Invalid visit id");
		throw new Error("תקלה בעדכון");
	}

	const { error } = await db
		.from("visits")
		.update({ approved: true })
		.eq("id", visitId)
		.is("approved", null);

	if (error) {
		console.error(error);
		throw new Error("תקלה בעדכון");
	}

	revalidatePath(headers().get("referer")!);
}

export async function rejectRequest(visitId: string, formData: FormData) {
	if (!Validations.uuid.test(visitId)) {
		console.error("Invalid visit id");
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
		console.error(error);
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
			console.error("Invalid cid");
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
		console.error(storageError);
		throw new Error("תקלה בהעלאת תמונה");
	}

	const { error } = await query.or(cidsOrStatements.join(","));

	if (error) {
		console.error(error);
		throw new Error("תקלה במחיקה");
	}

	revalidatePath(headers().get("referer")!);
}

export async function addPatient(
	signatureBase64: string,
	formData: FormData
): Promise<string[] | undefined> {
	const invalidInputsNames: string[] = [];

	const userId = formData.get("user-id")?.toString();
	if (!userId || !Validations.uuid.test(userId)) {
		console.error("Invalid user id");
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

	console.log(new Date().toDateString());

	const { error } = await db.from("patients").insert({
		cid,
		first_name: firstName,
		last_name: lastName,
		receiver_id: userId,
		birth_date: birthDate,
		address,
		profile_img_bucket_path: profilePicPath,
		reciever_signature_img_bucket_path: signatureImagePath,
	});

	if (error) {
		console.error(error);

		if (error.code === "23505") {
			// Patient cid already regitered
			throw new Error("מטופל עם מספר זהות זה קיים במערכת");
		}

		throw new Error("תקלה בהוספה");
	}

	redirect(
		"/patients-management?sort-by=reception-time&order-directions=DESC"
	);
}

export async function checkPatient(formData: FormData) {
	const cid = formData.get("state-id")?.toString();

	assert(cid && Validations.cid(cid), "מס' זהות שהוזן אינו תקין");

	const { data, error } = await db
		.from("patients")
		.select("*")
		.eq("cid", cid)
		.maybeSingle();

	if (error) {
		console.error(error);
		throw new Error("תקלה באימות");
	}

	if (!data) {
		throw new Error("מטופל עם מס' זהות זה אינו נמצא במערכת");
	}
}

export async function createVisit(patientCid: string, formData: FormData) {
	assertCallback(patientCid && Validations.cid(patientCid), (error) => {
		console.log(patientCid);

		console.error("Invalid patient cid");
		throw error;
	});

	const patient = await db
		.from("patients")
		.select("*")
		.eq("cid", patientCid)
		.maybeSingle();
	assert(patient, "המטופל לא נמצא במערכת");

	const invalidInputsNames: string[] = [];

	const visitTime = formData.get("visit-time")?.toString();

	assertCallback(visitTime && Validations.date(visitTime), () =>
		invalidInputsNames.push("visitor-time")
	);

	const visitorCid = formData.get("visitor-state-id")?.toString();
	assertCallback(visitorCid && Validations.cid(visitorCid), () =>
		invalidInputsNames.push("visitor-state-id")
	);

	const visitorFirstName = formData.get("visitor-first-name")?.toString();
	assertCallback(
		visitorFirstName && Validations.hebrewName.test(visitorFirstName),
		() => invalidInputsNames.push("visitor-first-name")
	);

	const visitorLastName = formData.get("visitor-last-name")?.toString();
	assertCallback(
		visitorLastName && Validations.hebrewName.test(visitorLastName),
		() => invalidInputsNames.push("visitor-last-name")
	);

	const visitorPhoneNumber = formData.get("visitor-phone-number")?.toString();
	assertCallback(
		!visitorPhoneNumber ||
			(visitorPhoneNumber &&
				Validations.phoneNumber.test(visitorPhoneNumber)),
		() => invalidInputsNames.push("visitor-phone-number")
	);

	const visitorEmail = formData.get("visitor-email")?.toString();
	assertCallback(
		!visitorEmail || (visitorEmail && Validations.email.test(visitorEmail)),
		() => invalidInputsNames.push("visitor-email")
	);

	const visitorRelation = formData.get("visitor-relation")?.toString();
	console.log(visitorRelation);

	assertCallback(
		visitorRelation &&
			(visitorRelation === "בחר כאן" ||
				RELATIONS.includes(visitorRelation)),
		() => invalidInputsNames.push("visitor-relation")
	);

	const extraVisitorCid = formData.get("extra-visitor-state-id")?.toString();
	const extraVisitorFirstName = formData
		.get("extra-visitor-first-name")
		?.toString();
	const extraVisitorLastName = formData
		.get("extra-visitor-last-name")
		?.toString();

	const enteredExtraVisitor =
		extraVisitorCid || extraVisitorFirstName || extraVisitorLastName;

	assertCallback(
		(!enteredExtraVisitor && !extraVisitorCid) ||
			(extraVisitorCid && Validations.cid(extraVisitorCid)),
		() => invalidInputsNames.push("extra-visitor-state-id")
	);

	assertCallback(
		(!enteredExtraVisitor && !extraVisitorFirstName) ||
			(extraVisitorFirstName &&
				Validations.hebrewName.test(extraVisitorFirstName)),
		() => invalidInputsNames.push("extra-visitor-first-name")
	);

	assertCallback(
		(!enteredExtraVisitor && !extraVisitorLastName) ||
			(extraVisitorLastName &&
				Validations.hebrewName.test(extraVisitorLastName)),
		() => invalidInputsNames.push("extra-visitor-last-name")
	);

	const extraVisitorRelation = formData
		.get("extra-visitor-relation")
		?.toString();
	assertCallback(
		extraVisitorRelation &&
			(extraVisitorRelation === "בחר כאן" ||
				RELATIONS.includes(extraVisitorRelation)),
		() => invalidInputsNames.push("extra-visitor-relation")
	);

	if (invalidInputsNames.length > 0) {
		return invalidInputsNames;
	}

	// Check if exists beforehand
	const { data: visitorExists } = await db
		.from("visitors")
		.select()
		.eq("cid", visitorCid)
		.maybeSingle();

	if (!visitorExists) {
		const { error: visitorInsertError } = await db.from("visitors").insert({
			cid: visitorCid,
			first_name: visitorFirstName,
			last_name: visitorLastName,
			phone_number: visitorPhoneNumber,
			email: visitorEmail,
			relation: visitorRelation,
		});

		if (visitorInsertError) console.error(visitorInsertError);
		assert(!visitorInsertError, "תקלה");
	}

	if (enteredExtraVisitor && extraVisitorCid) {
		console.log(4);

		const { data: extraVisitorExists } = await db
			.from("visitors")
			.select()
			.eq("cid", extraVisitorCid)
			.maybeSingle();

		// Check if exists beforehand
		if (!extraVisitorExists) {
			console.log(5);

			const { error: extraVisitorInsertError } = await db
				.from("visitors")
				.insert({
					cid: extraVisitorCid!,
					first_name: extraVisitorFirstName!,
					last_name: extraVisitorLastName!,
					relation: extraVisitorRelation,
				});

			if (extraVisitorInsertError) console.error(extraVisitorInsertError);
			assert(!extraVisitorInsertError, "תקלה");
		}
	}

	const { error } = await db.from("visits").insert({
		datetime: visitTime,
		patient_cid: patientCid,
		visitor_id: visitorCid,
		extra_visitor_id: enteredExtraVisitor ? extraVisitorCid : null,
	});

	if (error) {
		console.error(error);
		throw new Error("תקלה");
	}
}
