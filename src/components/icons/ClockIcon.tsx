import { memo, SVGProps } from "react";

export default memo(function ClockIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="31"
			height="31"
			viewBox="0 0 31 31"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle cx="15.5" cy="15.5" r="15.5" />
			<rect x="14" y="6" width="3" height="11" rx="1.5" fill="white" />
			<rect
				x="23.2439"
				y="21.1226"
				width="3"
				height="10.0728"
				rx="1.5"
				transform="rotate(135 23.2439 21.1226)"
				fill="white"
			/>
		</svg>
	);
});
