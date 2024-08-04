import { memo } from "react";

const genericMemo: <T>(component: T) => T = memo;

export default genericMemo;
