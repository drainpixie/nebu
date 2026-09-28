import { Endpoint } from "../../endpoint.js";

export const SendRedaction = new Endpoint({
	method: "PUT",
	endpoint: "/_matrix/client/v3/rooms/{roomId}/redact/{eventId}/{txnId}",
	path: {
		roomId: "string",
		eventId: "string",
		txnId: "string",
	},
	request: {
		reason: "string",
	},
	response: {
		event_id: "string",
	},
});
