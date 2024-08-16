import { handleBlurOnOutsideClick } from "@/utils/dom";
import React, {
	FormHTMLAttributes,
	forwardRef,
	ReactNode,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import styles from "./popover-form.module.scss";

import { useDetectMobile } from "@/contexts/detectMobile";

import Button from "../theme/Button";
import XIcon from "../icons/XIcon";

export type PopoverSubmitHandler = (
	e: React.FormEvent<HTMLFormElement>,
	close: () => void
) => void;

type Props = {
	title: string;
	openingButtonOptions: {
		name: string;
		extraHighlightCondition?: boolean;
	};
	onSubmit: PopoverSubmitHandler;
	footerButtons?: ReactNode;
} & OmitStrict<
	FormHTMLAttributes<HTMLFormElement>,
	"tabIndex" | "onBlur" | "onSubmit" | "title"
>;

export default forwardRef<HTMLFormElement, PropsWithRequiredChildren<Props>>(
	function PopoverForm(
		{
			title,
			openingButtonOptions,
			onSubmit,
			children,
			footerButtons,
			...formProps
		},
		ref
	) {
		const isMobile = useDetectMobile();
		const [isFormOpen, setIsFormOpen] = useState(false);
		const formRef = useRef<HTMLFormElement>(null);

		useImperativeHandle(ref, () => formRef.current!, []);

		return (
			<div className={styles.popover}>
				<Button
					variant="outline"
					colorVariant={
						openingButtonOptions.extraHighlightCondition ||
						isFormOpen
							? "primary"
							: undefined
					}
					onClick={() => {
						if (formRef.current) {
							formRef.current.dataset.open = "true";
							formRef.current.focus();
							setIsFormOpen(true);
						}
					}}
				>
					{openingButtonOptions.name}
				</Button>
				<form
					ref={formRef}
					tabIndex={0}
					data-open={isFormOpen}
					onBlur={(e) =>
						handleBlurOnOutsideClick(e, () => {
							if (!isMobile) {
								setIsFormOpen(false);
								formRef.current?.reset();
							}
						})
					}
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit(e, () => setIsFormOpen(false));
					}}
					{...formProps}
				>
					{isMobile && (
						<legend>
							{title}
							<button
								className={styles["close-button"]}
								onClick={(e) => {
									e.preventDefault();
									setIsFormOpen(false);
									formRef.current?.reset();
								}}
							>
								<XIcon />
							</button>
						</legend>
					)}
					{children}
					<footer className={styles["extra-footer-buttons"]}>
						{footerButtons || (
							<Button variant="filled" colorVariant="primary">
								החל
							</Button>
						)}
					</footer>
				</form>
			</div>
		);
	}
);
