"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { isMobileCross } from "@/utils/mobile";

const DetectMobileContext = createContext<boolean>(false);

export function useDetectMobile() {
	return useContext(DetectMobileContext);
}

export function DetectMobileContextProvider({ children }: PropsWithChildren) {
	const [isMobile] = useState(isMobileCross());

	return (
		<DetectMobileContext.Provider value={isMobile}>
			{children}
		</DetectMobileContext.Provider>
	);
}
