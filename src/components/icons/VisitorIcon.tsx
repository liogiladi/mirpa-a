import { memo, SVGProps } from "react";

export default memo(function VisitorIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="39"
			height="35"
			viewBox="0 0 39 35"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle cx="17.5" cy="8.5" r="8.5" />
			<path d="M3.86077 24.595C4.38085 23.7322 5.19215 23.0837 6.14831 22.7665L15.6896 19.6007C16.8675 19.2099 18.1376 19.1939 19.325 19.5551L29.6607 22.6986C30.8297 23.0542 31.7886 23.8965 32.292 25.0099V25.0099C33.5615 27.818 31.5079 31 28.4262 31H7.47858C4.19126 31 2.16371 27.4104 3.86077 24.595V24.595Z" />
			<rect
				x="19"
				y="20"
				width="19"
				height="14"
				rx="2"
				stroke="white"
				strokeWidth="2"
			/>
			<rect x="24" y="18" width="9" height="4" rx="1" />
		</svg>
	);
});
