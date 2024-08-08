import React, { memo, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export default memo(function AccordionArrowIcon(props: Props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={20}
			height={12}
			fill="none"
			viewBox="0 0 20 12"
			{...props}
		>
			<path
				stroke="#767676"
				strokeWidth={2}
				d="M18.318 1.023 9.66 9.681 1.002 1.023"
			/>
		</svg>
	);
});
