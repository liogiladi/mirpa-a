import React, { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export default function ArowDownIcon(props: Props) {
  return (
    <svg
      width="15"
      height="21"
      viewBox="0 0 15 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.8383 20.5349C7.22883 20.9254 7.86199 20.9254 8.25252 20.5349L14.6165 14.171C15.007 13.7804 15.007 13.1473 14.6165 12.7567C14.226 12.3662 13.5928 12.3662 13.2023 12.7567L7.54541 18.4136L1.88856 12.7567C1.49803 12.3662 0.864866 12.3662 0.474342 12.7567C0.0838174 13.1473 0.0838174 13.7804 0.474342 14.1709L6.8383 20.5349ZM6.54541 0.493164L6.54541 19.8278L8.54541 19.8278L8.54541 0.493164L6.54541 0.493164Z"
        fill="#32AFB7"
      />
    </svg>
  );
}
