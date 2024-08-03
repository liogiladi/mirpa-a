import {
	MouseEventHandler,
	PropsWithChildren,
	ReactEventHandler,
	RefObject,
	useCallback,
	useEffect,
} from "react";
import styles from "./dialog.module.scss";

type Props = {
	dialogRef: RefObject<HTMLDialogElement>;
	closeOnBackdropClick: boolean;
	className?: string;
	onClose?: ReactEventHandler<HTMLDialogElement>;
};

export default function Dialog({
	dialogRef,
	closeOnBackdropClick = true,
	className = "",
	onClose,
	children,
}: PropsWithChildren<Props>) {
	const handleBackdropClick: MouseEventHandler = useCallback(
		(e) => {
			if (!dialogRef.current || !closeOnBackdropClick) return;

			const rect = dialogRef.current.getBoundingClientRect();
			const isInDialog =
				rect.top <= e.clientY &&
				e.clientY <= rect.top + rect.height &&
				rect.left <= e.clientX &&
				e.clientX <= rect.left + rect.width;

			if (!isInDialog) {
				dialogRef.current.close();
			}
		},
		[closeOnBackdropClick, dialogRef]
	);

	return (
		<dialog
			ref={dialogRef}
			className={`${styles.dialog} ${className}`}
			onClick={handleBackdropClick}
			onClose={onClose}
		>
			{children}
		</dialog>
	);
}
