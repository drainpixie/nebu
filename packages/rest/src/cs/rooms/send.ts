import { Endpoint } from "../../endpoint.js";

export const SendMessage = new Endpoint({
	method: "PUT",
	endpoint: "/_matrix/client/v3/rooms/{roomId}/send/{eventType}/{txnId}",
	path: {
		roomId: "string",
		eventType: "string",
		txnId: "string",
	},
	request: {
		"[string]": "unknown",
	},
	response: {
		event_id: "string",
	},
});
