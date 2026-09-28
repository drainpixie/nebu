import { Endpoint } from "../../endpoint.js";

export const SetState = new Endpoint({
	method: "PUT",
	endpoint: "/_matrix/client/v3/rooms/{roomId}/state/{eventType}/{stateKey}",
	path: {
		roomId: "string",
		eventType: "string",
		stateKey: "string",
	},
	request: {
		"[string]": "unknown",
	},
	response: {
		event_id: "string",
	},
});
