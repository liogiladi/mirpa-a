"use client";

import { createContext, useContext, useState } from "react";
import { isMobileCrossEnvironment } from "@/utils/mobile";

const DetectMobileContext = createContext<boolean>(false);

export function useDetectMobile() {
	return useContext(DetectMobileContext);
}

export function DetectMobileContextProvider({
	children,
}: PropsWithRequiredChildren) {
	const [isMobile] = useState(isMobileCrossEnvironment());

	return (
		<DetectMobileContext.Provider value={isMobile}>
			{children}
		</DetectMobileContext.Provider>
	);
}
