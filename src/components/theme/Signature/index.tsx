import React, {
	forwardRef,
	memo,
	MouseEventHandler,
	MutableRefObject,
	TouchEventHandler,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import styles from "./signature.module.scss";
import XIcon from "@/components/icons/XIcon";

type Props = {
	id: string;
	label: string;
	required?: boolean;
	outputRef?: MutableRefObject<string>;
};

type MousePosition = {
	x: number;
	y: number;
};

export default memo(function Signature({
	id,
	label,
	required,
	outputRef,
}: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const previousPosition = useRef<MousePosition | null>(null);
	const drawingRef = useRef(false);

	const [filled, setFilled] = useState(false);

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current.width = canvasRef.current.offsetWidth;
			canvasRef.current.height = canvasRef.current.offsetHeight;

			const preventScroll = (e: TouchEvent) => {
				if (e.target == canvasRef.current) {
					e.preventDefault();
				}
			};

			// Prevent scrolling when touching the canvas
			canvasRef.current.parentElement?.parentElement!.addEventListener(
				"touchstart",
				preventScroll,
				false
			);
			canvasRef.current.parentElement?.parentElement!.addEventListener(
				"touchend",
				preventScroll,
				false
			);
			canvasRef.current.parentElement?.parentElement!.addEventListener(
				"touchmove",
				preventScroll,
				false
			);

			const canvas = canvasRef.current;

			return () => {
				canvas.parentElement!.parentElement!.removeEventListener(
					"touchstart",
					preventScroll
				);
				canvas.parentElement!.parentElement!.removeEventListener(
					"touchmove",
					preventScroll
				);
				canvas.parentElement!.parentElement!.removeEventListener(
					"touchend",
					preventScroll
				);
			};
		}
	}, []);

	const handleInputDown = () => (drawingRef.current = true);
	const handleInputUp = () => {
		drawingRef.current = false;
		previousPosition.current = null;

		if (outputRef && canvasRef.current) {
			outputRef.current = canvasRef.current.toDataURL();
		}
	};
	const handleInputMove = (
		e:
			| Parameters<MouseEventHandler<HTMLCanvasElement>>[0]
			| Parameters<TouchEventHandler<HTMLCanvasElement>>[0],
		mousePos: MousePosition
	) => {
		if (!filled) setFilled(true);

		if (drawingRef.current && canvasRef.current && e.currentTarget) {
			const ctx = canvasRef.current.getContext("2d");

			if (!previousPosition.current) {
				previousPosition.current = mousePos;
			} else if (previousPosition.current && ctx) {
				ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.moveTo(
					previousPosition.current!.x,
					previousPosition.current!.y
				);
				ctx.lineTo(mousePos.x, mousePos.y);
				ctx.stroke();
				ctx.closePath();

				previousPosition.current = mousePos;
			}
		}
	};

	return (
		<div className={styles.signature}>
			<label htmlFor={id}>
				{label}
				{required && <span className={styles.required}>*</span>}
				{filled && (
					<button
						type="button"
						className={styles["clear-button"]}
						onClick={(e) => {
							e.preventDefault();
							if (canvasRef.current) {
								const ctx = canvasRef.current.getContext("2d");
								if (ctx) {
									ctx.clearRect(
										0,
										0,
										canvasRef.current.width,
										canvasRef.current.height
									);

									setFilled(false);

									if (outputRef) {
										outputRef.current = "";
									}
								}
							}
						}}
					>
						<XIcon />
					</button>
				)}
			</label>
			<canvas
				ref={canvasRef}
				width={"100%"}
				height={150}
				onMouseDown={handleInputDown}
				onTouchStart={handleInputDown}
				onMouseUp={handleInputUp}
				onTouchEnd={handleInputUp}
				onTouchCancel={handleInputUp}
				onMouseMove={(e) =>
					handleInputMove(e, {
						x: e.nativeEvent.offsetX,
						y: e.nativeEvent.offsetY,
					})
				}
				onTouchMove={(e) => {
					const rect = e.currentTarget.getBoundingClientRect();
					handleInputMove(e, {
						x: e.targetTouches[0].pageX - rect.left,
						y: e.targetTouches[0].pageY - rect.top,
					});
				}}
			></canvas>
		</div>
	);
});
