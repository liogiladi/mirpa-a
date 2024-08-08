import { SVGProps } from "react";

export default function XIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="19"
			height="19"
			viewBox="0 0 19 19"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect
				x="0.176697"
				y="1.62537"
				width="2.11458"
				height="23.5625"
				rx="1.05729"
				transform="rotate(-45 0.176697 1.62537)"
				fill="black"
			/>
			<rect
				x="16.8379"
				y="0.130096"
				width="2.11458"
				height="23.5625"
				rx="1.05729"
				transform="rotate(45 16.8379 0.130096)"
				fill="black"
			/>
		</svg>
	);
}
