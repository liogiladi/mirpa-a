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
		throw new Error();
	}

	const { error } = await db
		.from("visits")
		.update({ approved: true })
		.eq("id", visitId)
		.is("approved", null);

	if (error) {
		console.error(error);
		throw new Error();
	}

	revalidatePath(headers().get("referer")!);
}

export async function rejectRequest(
	visitId: string,
	formData: FormData
): Promise<string> {
	if (!Validations.uuid.test(visitId)) {
		console.error("Invalid visit id");
		throw new Error();
	}

	const rejectionReason = formData.get("rejection-reason")?.toString();

	if (
		!rejectionReason ||
		!Validations.hebrewDescription.test(rejectionReason)
	) {
		return "סיבת הסירוב יכולה להכיל רק: אותיות בעברית, מספרים, פסיקים ונקודות";
	}

	const { error } = await db
		.from("visits")
		.update({ approved: false, rejection_reason: rejectionReason })
		.eq("id", visitId)
		.is("approved", null);

	if (error) {
		console.error(error);
		throw new Error();
	}

	revalidatePath(headers().get("referer")!);
	return "";
}

export async function deletePatients(
	selectedPatientCIDs: string[]
): Promise<string> {
	if (selectedPatientCIDs.length === 0) {
		return "לא נבחרו מטופלים למחיקה";
	}

	let query = db.from("patients").delete();
	let stoargeQuery = db.storage.from("pictures");

	const storagePathsToRemove: string[] = [];
	const cidsOrStatements: string[] = [];

	for (const cid of selectedPatientCIDs) {
		if (!Validations.cid(cid)) {
			console.error("Invalid cid");
			throw new Error();
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
		return "תקלה בהעלאת תמונה";
	}

	const { error } = await query.or(cidsOrStatements.join(","));

	if (error) {
		console.error(error);
		return "תקלה במחיקה";
	}

	revalidatePath(headers().get("referer")!);
	return "";
}

export async function addPatient(
	signatureBase64: string,
	formData: FormData
): Promise<{ error?: string; invalidInputsNames: string[] }> {
	const invalidInputsNames: string[] = [];

	const userId = formData.get("user-id")?.toString();
	if (!userId || !Validations.uuid.test(userId)) {
		console.error("Invalid user id");
		throw new Error();
	}

	const signatureImageFile = signatureBase64
		? dataURLtoFile(signatureBase64, userId)
		: null;
	if (!signatureImageFile) {
		return { error: "יש להביא חתימה מאשרת", invalidInputsNames: [] };
	}

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
		return {
			error: 'גודל קובץ לא יכול לעלות על 10 מ"ב',
			invalidInputsNames: ["profile-pic"],
		};
	}

	let profilePicPath = null;

	if (invalidInputsNames.length > 0) {
		return { error: "חלק מהשדות שהוזנו אינו תקין", invalidInputsNames };
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
			return {
				error: "מטופל עם מספר זהות זה קיים במערכת",
				invalidInputsNames: [],
			};
		}

		throw new Error();
	}

	redirect(
		"/patients-management?sort-by=reception-time&order-directions=DESC"
	);
}

export async function checkPatient(formData: FormData): Promise<string> {
	const cid = formData.get("state-id")?.toString();

	if (!cid || !Validations.cid(cid)) {
		return "מס' זהות שהוזן אינו תקין";
	}

	const { data, error } = await db
		.from("patients")
		.select("*")
		.eq("cid", cid)
		.maybeSingle();

	if (error) {
		console.error(error);
		return "תקלה באימות";
	}

	if (!data) {
		return "מטופל עם מס' זהות זה אינו נמצא במערכת";
	}

	return "";
}

export async function createVisit(
	patientCid: string,
	formData: FormData
): Promise<{ error?: string; invalidInputsNames: string[] }> {
	assertCallback(patientCid && Validations.cid(patientCid), () => {
		throw error;
	});

	const patient = await db
		.from("patients")
		.select("*")
		.eq("cid", patientCid)
		.maybeSingle();

	if (!patient) {
		return { error: "המטופל לא נמצא במערכת", invalidInputsNames: [] };
	}

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

	if (!visitorPhoneNumber && !visitorEmail) {
		return {
			error: "יש להזין פרט ליצירת קשר",
			invalidInputsNames: ["visitor-email", "visitor-phone-number"],
		};
	}

	let visitorRelation: string | null | undefined = formData
		.get("visitor-relation")
		?.toString();
	if (visitorRelation === "בחר כאן") visitorRelation = null;

	assertCallback(
		!visitorRelation ||
			(visitorRelation && RELATIONS.includes(visitorRelation)),
		() => invalidInputsNames.push("visitor-relation")
	);

	const extraVisitorCid = formData.get("extra-visitor-state-id")?.toString();
	const extraVisitorFirstName = formData
		.get("extra-visitor-first-name")
		?.toString();
	const extraVisitorLastName = formData
		.get("extra-visitor-last-name")
		?.toString();

	let extraVisitorRelation: string | null | undefined = formData
		.get("extra-visitor-relation")
		?.toString();
	if (extraVisitorRelation === "בחר כאן") extraVisitorRelation = null;

	const enteredExtraVisitor =
		extraVisitorCid ||
		extraVisitorFirstName ||
		extraVisitorLastName ||
		extraVisitorRelation;

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

	assertCallback(
		!extraVisitorRelation ||
			(extraVisitorRelation && RELATIONS.includes(extraVisitorRelation)),
		() => invalidInputsNames.push("extra-visitor-relation")
	);

	if (invalidInputsNames.length > 0) {
		return { error: "חלק מהשדות שהוזנו אינו תקין", invalidInputsNames };
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
		const { data: extraVisitorExists } = await db
			.from("visitors")
			.select()
			.eq("cid", extraVisitorCid)
			.maybeSingle();

		// Check if exists beforehand
		if (!extraVisitorExists) {
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

	return { invalidInputsNames };
}
