export function assertCallback(
	value: unknown,
	callback: () => void
): asserts value {
	if (!value) {
		callback();
	}
}
