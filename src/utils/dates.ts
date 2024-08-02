export function getDateString(date: Date, daysBuffer: number = 0) {
	date.setDate(date.getDate() + daysBuffer);
	return date.toISOString().slice(0, 10);
}

export function getTimeString(date: Date) {
	return date.toLocaleTimeString("IL");
}
