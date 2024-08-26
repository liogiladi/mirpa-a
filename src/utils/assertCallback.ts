export function assertCallback(
	value: unknown,
	callback: (value: unknown) => void
): asserts value {
	if (!value) {
		callback(value);
	}
}
