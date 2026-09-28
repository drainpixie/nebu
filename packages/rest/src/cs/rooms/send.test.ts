import { describe, test, expect } from "vitest";
import { SendMessage } from "./send.js";

describe("SendMessage", () => {
	test("toRequest serializes properly", () => {
		const req = SendMessage.toRequest({
			roomId: "!test:example.org",
			eventType: "m.room.message",
			txnId: "12345",

			body: "Hello, world!",
			msgtype: "m.text",
		});

		expect(req).toEqual({
			method: "PUT",
			path: "/_matrix/client/v3/rooms/!test%3Aexample.org/send/m.room.message/12345",
			body: {
				body: "Hello, world!",
				msgtype: "m.text",
			},
		});
	});
});
