import { type } from "arktype";
import { Endpoint } from "../../endpoint.js";

export const EventFilter = type({
	limit: "number",
	not_senders: "string[]",
	not_types: "string[]",
	senders: "string[]",
	types: "string[]",
});

export const RoomEventFilter = type({
	contains_url: "boolean",
	include_redundant_members: "boolean",
	lazy_load_members: "boolean",
	limit: "number",
	not_rooms: "string[]",
	not_senders: "string[]",
	not_types: "string[]",
	rooms: "string[]",
	senders: "string[]",
	types: "string[]",
	/** @addedIn v1.4 */
	unread_thread_notifications: "boolean",
});

export const RoomFilter = type({
	account_data: RoomEventFilter,
	ephemeral: RoomEventFilter,
	include_leave: "boolean",
	not_rooms: "string[]",
	rooms: "string[]",
	state: RoomEventFilter,
	timeline: RoomEventFilter,
});

export const UploadFilter = new Endpoint({
	method: "POST",
	endpoint: "/_matrix/client/v3/user/{userId}/filter",
	path: {
		userId: "string",
	},
	// Endpoint needs the object directly to extract keys, so we can't use a Filter type
	request: {
		account_data: EventFilter,
		event_fields: "string[]",
		event_format: '"client" | "federation"',
		presence: EventFilter,
		room: RoomFilter,
	},
	response: {
		filter_id: "string",
	},
});

export const GetFilter = new Endpoint({
	method: "GET",
	endpoint: "/_matrix/client/v3/user/{userId}/filter/{filterId}",
	path: {
		userId: "string",
		filterId: "string",
	},
	response: {
		account_data: EventFilter,
		event_fields: "string[]",
		event_format: '"client" | "federation"',
		presence: EventFilter,
		room: RoomFilter,
	},
});
