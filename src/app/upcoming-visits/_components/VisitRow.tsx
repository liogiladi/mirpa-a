"use client";

import { Database } from "@/server/db.types";

type Props = {
	data: Omit<Database["public"]["Tables"]["visits"]["Row"], "id">;
};

export default function VisitRow({ data }: Props) {
	return <article>{JSON.stringify(data)}</article>;
}
