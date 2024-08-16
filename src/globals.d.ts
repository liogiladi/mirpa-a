export declare global {
	namespace globalThis {
		var isMobile: boolean;
		var currentPageName: string;
	}

	type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
	type PropsWithRequiredChildren<P> = P & { children: React.ReactNode };
}
