import { ReactNode } from "react";
import "./table.scss";

import genericMemo from "@/utils/genericMemo";
import { TupleOfLength } from "@/utils/types";

type Props<Width extends number> = {
	width: Width;
	columns: TupleOfLength<ReactNode, Width>;
	rows: TupleOfLength<ReactNode | null, Width>[];
	className?: string;
	onRowClick?: (rowData: TupleOfLength<string, Width>) => void;
};

export default genericMemo(function Table<Width extends number>({
	columns,
	rows,
	className = "",
	onRowClick,
}: Props<Width>) {
	return (
		<table className={`table ${className}`}>
			<thead>
				<tr>
					{(columns as string[]).map((column) => (
						<th key={column}>{column}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, i) => (
					<tr key={i} onClick={(e) => onRowClick?.(row)}>
						{(row as string[]).map((item, j) => (
							<td key={`${i},${j}`}>{item || "-"}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
});
