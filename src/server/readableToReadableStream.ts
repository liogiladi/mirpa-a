import "server-only";

import { Readable } from "node:stream";

export default function readableToReadableStream(
	readable: Readable
): ReadableStream<Uint8Array> {
	return new ReadableStream<Uint8Array>({
		start(controller) {
			readable.on("data", (chunk: Buffer) => {
				controller.enqueue(new Uint8Array(chunk));
			});

			readable.on("end", () => {
				controller.close();
				readable.destroy();
			});

			readable.on("error", (err: Error) => {
				controller.error(err);
			});
		},
		cancel() {
			readable.destroy();
		},
	});
}
