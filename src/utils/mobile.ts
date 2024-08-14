export function isMobileCross(): boolean {
	return (
		globalThis.isMobile ||
		(typeof document !== "undefined" &&
			document.documentElement.dataset.mobile === "true")
	);
}

export async function isMobileNodeJS(): Promise<boolean> {
	const uap = (await import("ua-parser-js")).default;
	const { headers } = await import("next/headers");

	const { os, device } = uap(headers().get("user-agent")!);

	return (
		["mobile", "tablet"].includes(device.type || "") ||
		["Android", "iOS", "WebOS"].includes(os.name || "")
	);
}
