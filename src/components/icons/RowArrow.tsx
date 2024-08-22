import { memo, SVGProps } from "react";
import SortArrowIcon from "./SortArrowIcon";

type Props = SVGProps<SVGSVGElement>;

export default memo(function RowArrow({ style, ...props }: Props) {
	return <SortArrowIcon style={{ rotate: "90deg", ...style }} {...props} />;
});
