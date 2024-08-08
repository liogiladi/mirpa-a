import { Tables } from "@/server/db.types";

export type JoinedVisit = Tables<"visits"> & {
	patient: Pick<Tables<"patients">, "cid" | "first_name" | "last_name">;
	visitor: Pick<
		Tables<"visitors">,
		"first_name" | "last_name" | "relation" | "phone_number" | "email"
	>;
	extra_visitor: Pick<
		Tables<"visitors">,
		"first_name" | "last_name" | "relation" | "phone_number" | "email"
	> | null;
};
