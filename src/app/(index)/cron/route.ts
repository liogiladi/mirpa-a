import db from "@/server/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	if (
		req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}

	// Delete Profiles
	const { data: profilesFiles, error: profilesFilesError } = await db.storage
		.from("pictures")
		.list(`patients-profiles`);

	if (profilesFilesError) console.error(profilesFilesError);
	else if (profilesFiles) {
		const filesToRemove = profilesFiles.map(
			(file) => `patients-profiles/${file.name}`
		);
		await db.storage.from("pictures").remove(filesToRemove);
	}

	// Delete Signatures
	const { data: signaturesFiles, error: signaturesFilesError } =
		await db.storage.from("pictures").list(`user-signatures`);

	if (signaturesFilesError) console.error(signaturesFilesError);
	else if (signaturesFiles) {
		const filesToRemove = signaturesFiles.map(
			(file) => `user-signatures/${file.name}`
		);
		await db.storage.from("pictures").remove(filesToRemove);
	}

	return NextResponse.json({ ok: true });
}
