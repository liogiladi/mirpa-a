import { ReactNode } from "react";
import { NextRequest } from "next/server";
import { Readable } from "node:stream";
import { chromium } from "playwright";

import Visits from "@/server/visits";
import { Assertions } from "@/server/assertions";
import readableToReadableStream from "@/server/readableToReadableStream";

import { TupleOfLength } from "@/utils/types";
import { SEARCH_QUERIES } from "@/utils/searchQueries";
import { getDateString, getTimeString } from "@/utils/dates";

import PDFPage from "@/components/pdf/PDFPage";
import Table from "@/components/Table";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;

	Assertions.visitsSearchParams(searchParams);

	const dateFilter = String(
		searchParams.get(SEARCH_QUERIES.dateFilter.name) ||
			getDateString(new Date())
	);

	const dateFilterType =
		searchParams.get(SEARCH_QUERIES.dateFilterType.name) ===
		SEARCH_QUERIES.dateFilterType.value
			? SEARCH_QUERIES.dateFilter.values.min
			: SEARCH_QUERIES.dateFilter.values.specific;

	const otherFilters = searchParams.get(SEARCH_QUERIES.filters.name)
		? JSON.parse(`[${searchParams.get(SEARCH_QUERIES.filters.name)}]`)
		: [];

	const visits = await Visits.getAllFilteredUpcomingJoined({
		date: {
			value: dateFilter,
			range: dateFilterType,
		},
		filters: otherFilters,
	});

	// Generating Pdf's contents
	const tableRowsValues: TupleOfLength<ReactNode, 13>[] = visits.map(
		(visit, index) => {
			const date = new Date(visit.datetime);

			return [
				index + 1 + "",
				`${visit.patient!.first_name} ${visit.patient!.last_name}`,
				visit.patient_cid,
				`${visit.visitor!.first_name} ${visit.visitor!.last_name}`,
				visit.visitor_id,
				visit.visitor!.relation,
				visit.visitor!.phone_number,
				visit.visitor!.email,
				visit.extra_visitor
					? `${visit.extra_visitor.first_name} ${visit.extra_visitor.last_name}`
					: null,
				visit.extra_visitor_id,
				visit.extra_visitor?.relation,
				getDateString(date, { format: true }),
				getTimeString(date),
			];
		}
	);

	const dateString = dateFilter.split("-").reverse().join("/");

	const title = `ביקורים ${
		dateFilterType === SEARCH_QUERIES.dateFilter.values.min ? "מ" : "ל"
	}-
						${dateString}`;

	const pdfContent = (
		<PDFPage title={title}>
			<Table
				width={13}
				columns={[
					"  ",
					"שם המטופל",
					"ת.ז המטופל",
					"שם המבקר",
					"ת.ז המבקר",
					"קרבת המבקר",
					"טלפון המבקר",
					"אימייל המבקר",
					"שם המבקר הנוסף",
					"ת.ז המבקר הנוסף",
					"קרבת המבקר הנוסף",
					"תאריך הביקור",
					"שעת הביקור",
				]}
				rows={tableRowsValues}
			/>
		</PDFPage>
	);

	const renderToStaticMarkup = (await import("react-dom/server"))
		.renderToStaticMarkup;
	const htmlString = renderToStaticMarkup(pdfContent);

	// Generating Pdf file
	const browser = await chromium.launch();
	const browserContext = await browser.newContext({ offline: true });
	const page = await browserContext.newPage();

	await page.setContent(htmlString);
	await page.addStyleTag({
		path: "./public/heebo.css",
	});
	await page.addStyleTag({
		path: "./src/app/pdf-document.scss",
	});
	await page.addStyleTag({ path: "./src/components/Table/table.scss" });

	const buffer = await page.pdf({
		format: "A4",
		printBackground: true,
		margin: {
			left: 10,
			right: 10,
			top: 10,
			bottom: 20,
		},
		footerTemplate: `
			<span style="font-size: 12px; width: 100%; text-align: center; color:black;">
			<div style="position:absolute; left:20px;" class="date"></div>
			<div style="position:absolute; right:20px; font-size:13px;">™המרפאה</div>
			<span class="pageNumber"></span>/<span class="totalPages"></span></span>
		`,
		displayHeaderFooter: true,
	});

	await browserContext.close();
	await browser.close();

	const stream = readableToReadableStream(Readable.from(buffer));

	const filename = title.replaceAll("/", ".");

	if (/[!@%\/\/\*\?\|:]/.test(filename)) {
		throw new Error(
			"file name cannot contain the following: !, @, %, /, \\, ?, *, :, |"
		);
	}

	const response = new Response(stream, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `inline; file="visit.pdf"; filename="${encodeURIComponent(
				filename
			).replace(/%0A|%09/g, "")}.pdf"`,
			"Access-Control-Expose-Headers": "Content-Disposition",
		},
	});

	return response;
}
