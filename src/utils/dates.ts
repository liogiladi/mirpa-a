type DateStringOptions = {
	daysBuffer: number;
	format: boolean;
};

const defaultDateStringOptions: DateStringOptions = {
	daysBuffer: 0,
	format: false,
};

export function getDateString(
	date: Date,
	options: Partial<DateStringOptions> = {}
) {
	const usedOptions: DateStringOptions = {
		...defaultDateStringOptions,
		...options,
	};

	date.setDate(date.getDate() + usedOptions.daysBuffer);

	let dateString = date.toISOString().slice(0, 10);
	if (usedOptions.format) {
		dateString = dateString.split("-").reverse().join("/");
	}

	return dateString;
}

export function getTimeString(date: Date) {
	return date.toLocaleTimeString("IL").slice(0, 5);
}
