import { memo, SVGProps } from "react";

export default memo(function CalanderIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="30"
			height="28"
			viewBox="0 0 30 28"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<mask id="path-1-inside-1_285_34" fill="white">
				<path d="M0 4C0 1.79086 1.79086 0 4 0H26C28.2091 0 30 1.79086 30 4V19C30 21.2091 28.2091 23 26 23H4C1.79086 23 0 21.2091 0 19V4Z" />
			</mask>
			<path d="M0 4C0 1.79086 1.79086 0 4 0H26C28.2091 0 30 1.79086 30 4V19C30 21.2091 28.2091 23 26 23H4C1.79086 23 0 21.2091 0 19V4Z" />
			<path
				d="M0 0H30H0ZM30 19C30 21.7614 27.7614 24 25 24H5C2.23858 24 0 21.7614 0 19C0 20.6569 1.79086 22 4 22H26C28.2091 22 30 20.6569 30 19ZM0 23V0V23ZM30 0V23V0Z"
				mask="url(#path-1-inside-1_285_34)"
			/>
			<mask id="path-3-inside-2_285_34" fill="white">
				<path d="M0 9C0 6.79086 1.79086 5 4 5H26C28.2091 5 30 6.79086 30 9V24C30 26.2091 28.2091 28 26 28H4C1.79086 28 0 26.2091 0 24V9Z" />
			</mask>
			<path d="M0 9C0 6.79086 1.79086 5 4 5H26C28.2091 5 30 6.79086 30 9V24C30 26.2091 28.2091 28 26 28H4C1.79086 28 0 26.2091 0 24V9Z" />
			<path
				d="M0 9C0 6.23858 2.23858 4 5 4H25C27.7614 4 30 6.23858 30 9C30 7.34315 28.2091 6 26 6H4C1.79086 6 0 7.34315 0 9ZM30 28H0H30ZM0 28V5V28ZM30 5V28V5Z"
				fill="white"
				mask="url(#path-3-inside-2_285_34)"
			/>
			<rect x="5" y="11" width="3" height="3" rx="1.5" fill="white" />
			<rect x="9" y="11" width="3" height="3" rx="1.5" fill="white" />
			<rect x="5" y="15" width="3" height="3" rx="1.5" fill="white" />
			<rect x="9" y="15" width="3" height="3" rx="1.5" fill="white" />
			<rect x="5" y="19" width="3" height="3" rx="1.5" fill="white" />
			<rect x="9" y="19" width="3" height="3" rx="1.5" fill="white" />
			<rect x="14" y="11" width="3" height="3" rx="1.5" fill="white" />
			<rect x="14" y="15" width="3" height="3" rx="1.5" fill="white" />
			<rect x="18" y="11" width="3" height="3" rx="1.5" fill="white" />
			<rect x="18" y="15" width="3" height="3" rx="1.5" fill="white" />
			<rect x="18" y="19" width="3" height="3" rx="1.5" fill="white" />
			<rect x="22" y="11" width="3" height="3" rx="1.5" fill="white" />
			<rect x="22" y="15" width="3" height="3" rx="1.5" fill="white" />
		</svg>
	);
});
