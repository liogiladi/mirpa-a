import { FocusEventHandler } from "react";

export function handleBlurOnOutsideClick(
	e: Parameters<FocusEventHandler<HTMLElement>>[0],
	callback: () => Promise<void> | void
) {
	if (
		!e.relatedTarget ||
		(e.relatedTarget instanceof HTMLElement &&
			e.relatedTarget !== e.currentTarget &&
			!e.currentTarget.contains(e.relatedTarget))
	) {
		callback();
	}
}
