export type SearchParams = { [key: string]: string | string[] | undefined };
export type SearchParamsParamater<T extends Object> = { searchParams: T };

export type TupleOfLength<
	T,
	N extends number,
	R extends T[] = []
> = R["length"] extends N ? R : TupleOfLength<T, N, [T, ...R]>;
