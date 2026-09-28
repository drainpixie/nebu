import { describe, test, expect } from "vitest";
import { SetState } from "./state.js";

describe("SetState", () => {
	describe("toRequest serializes properly", () => {
		test("empty state key", () => {
			const req = SetState.toRequest({
				roomId: "!test:example.org",
				eventType: "m.room.name",
				stateKey: "",

				name: "Test Room",
			});

			expect(req).toEqual({
				method: "PUT",
				path: "/_matrix/client/v3/rooms/!test%3Aexample.org/state/m.room.name/",
				body: {
					name: "Test Room",
				},
			});
		});

		test("non-empty state key", () => {
			const req = SetState.toRequest({
				roomId: "!test:example.org",
				eventType: "m.room.member",
				stateKey: "@user:example.org",

				membership: "join",
			});

			expect(req).toEqual({
				method: "PUT",
				path: "/_matrix/client/v3/rooms/!test%3Aexample.org/state/m.room.member/%40user%3Aexample.org",
				body: {
					membership: "join",
				},
			});
		});
	});
});
