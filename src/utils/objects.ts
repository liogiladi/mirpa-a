export function taintObj<T, K extends keyof T>(
	obj: T,
	keys: K[]
): OmitStrict<T, K> {
	const tainted = { ...obj };

	for (const key of keys) {
		delete tainted[key];
	}

	return tainted;
}
