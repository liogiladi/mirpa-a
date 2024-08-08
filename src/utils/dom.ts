import { FocusEventHandler, MouseEventHandler } from "react";

export function handleClickOutside<
	T extends MouseEventHandler<HTMLElement> | FocusEventHandler<HTMLElement>
>(e: Parameters<T>[0], callback: () => Promise<void> | void) {
	if (
		!e.relatedTarget ||
		(e.relatedTarget instanceof HTMLElement &&
			e.relatedTarget !== e.currentTarget &&
			!e.currentTarget.contains(e.relatedTarget))
	) {
		callback();
	}
}
