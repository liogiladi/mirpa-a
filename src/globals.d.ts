import { PropsWithChildren } from "react";

export declare global {
	namespace globalThis {
		var isMobile: boolean;
		var currentPageName: string;
	}

	type OmitProperties<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
	type PropsWithRequiredChildren<P = unknown> = P & {
		children: React.ReactNode;
	};
}
