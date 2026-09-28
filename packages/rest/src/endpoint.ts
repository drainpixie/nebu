import { Type, type } from "arktype";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

/**
 * The serialized HTTP request information produced by an {@link Endpoint} instance after it has
 * been instantiated with data.
 *
 * The endpoint's path and query parameters are serialized into {@link path}, and if the endpoint
 * defines a request body, it is serialized into {@link body}.
 */
export interface EndpointRequest {
	/** The HTTP method for the request. */
	method: HttpMethod;
	/** The URL-safe request path, including any substituted path and query parameters. */
	path: string;
	/** The request body, if the endpoint defines a request body. */
	body?: unknown;
}

/**
 * Infers the parameters accepted by {@link Endpoint.toRequest} from ArkType definitions.
 *
 * @typeParam PathDef - The ArkType definition for the path parameters.
 * @typeParam QueryDef - The ArkType definition for the query parameters.
 * @typeParam ReqDef - The ArkType definition for the request body.
 */
type InferEndpointArgsFromDefs<PathDef, QueryDef, ReqDef> = (PathDef extends undefined
	? {}
	: type.infer<PathDef>) &
	(QueryDef extends undefined ? {} : type.infer<QueryDef>) &
	(ReqDef extends undefined ? {} : type.infer<ReqDef>);

/**
 * Extracts the ArkType definitions from an {@link Endpoint} instance.
 *
 * @typeParam E - The {@link Endpoint} instance.
 */
type EndpointDefs<E extends Endpoint> =
	E extends Endpoint<infer PathDef, infer QueryDef, infer ReqDef, infer RespDef>
		? [PathDef, QueryDef, ReqDef, RespDef]
		: never;

/**
 * Infers the parameters accepted by {@link Endpoint.toRequest} from an {@link Endpoint} instance.
 *
 * @typeParam E - The {@link Endpoint} instance.
 */
export type InferEndpointArgs<E extends Endpoint> =
	EndpointDefs<E> extends [infer PathDef, infer QueryDef, infer ReqDef, unknown]
		? InferEndpointArgsFromDefs<PathDef, QueryDef, ReqDef>
		: never;

/**
 * Infers the response type of an {@link Endpoint} instance.
 *
 * @typeParam E - The {@link Endpoint} instance.
 */
export type InferEndpointResponse<E extends Endpoint> =
	EndpointDefs<E> extends [unknown, unknown, unknown, infer RespDef] ? RespDef : never;

/**
 * Defines a REST endpoint in the Matrix API, and provides type-safe methods to construct and
 * validate requests and responses for that endpoint.
 *
 * An endpoint may define path parameters, query parameters, and a request body, each of which is
 * validated against an {@link https://arktype.io/ ArkType} definition. The endpoint also defines a
 * response ArkType.
 *
 * @typeParam PathDef - The ArkType definition for the path parameters.
 * @typeParam QueryDef - The ArkType definition for the query parameters.
 * @typeParam ReqDef - The ArkType definition for the request body.
 * @typeParam RespDef - The ArkType definition for the response body.
 *
 * @example
 * ```ts
 * let getState = new Endpoint({
 *     method: "GET",
 *     endpoint: "/_matrix/client/v3/rooms/{roomId}/state/{eventType}/{stateKey}",
 *     path: {
 *         roomId: "string",
 *         eventType: "string",
 *         stateKey: "string",
 *     },
 *     query: {
 *         format: '"content" | "event"',
 *     },
 *     response: Event,
 * });
 * let req = getState.toRequest({
 *     roomId: "!opaque",
 *     eventType: "m.room.name",
 *     stateKey: "",
 *     format: "event",
 * });
 * ```
 */
export class Endpoint<
	const PathDef = undefined,
	const QueryDef = undefined,
	const ReqDef = undefined,
	const RespDef = unknown,
> {
	/** The HTTP method for the endpoint. */
	readonly method: HttpMethod;
	/**
	 * The endpoint URL, with path parameters denoted by `{paramName}` placeholders.
	 * For example, `/rooms/{roomId}/state/{eventType}/{stateKey}`.
	 */
	readonly endpoint: string;

	/**
	 * An ArkType definition for parameters intended to be substituted into the endpoint's URL, if
	 * any.
	 */
	private readonly path?: PathDef extends undefined ? undefined : type.instantiate<PathDef>;
	/**
	 * The names of the endpoint's path parameters.
	 *
	 * This is derived from {@link path}, and used to determine which input keys should be treated
	 * as path parameters when constructing a request.
	 */
	private readonly pathKeys: string[];
	/**
	 * An ArkType definition for parameters intended to be serialized into the endpoint's query
	 * string, if any.
	 */
	private readonly query?: QueryDef extends undefined ? undefined : type.instantiate<QueryDef>;
	/**
	 * The names of the endpoint's query parameters.
	 *
	 * This is derived from {@link query}, and used to determine which input keys should be treated
	 * as query parameters when constructing a request.
	 */
	private readonly queryKeys: string[];
	/**
	 * An ArkType definition for the request body, if any.
	 */
	private readonly request?: ReqDef extends undefined ? undefined : type.instantiate<ReqDef>;
	/**
	 * An ArkType definition for the response body.
	 */
	readonly response: type.instantiate<RespDef>;

	/**
	 * Creates a new {@link Endpoint} instance.
	 *
	 * @param options - The options for the endpoint.
	 * @param options.method - The HTTP method for the endpoint.
	 * @param options.endpoint - The endpoint URL, with path parameters denoted by `{paramName}`
	 *   placeholders.
	 * @param options.path - An ArkType definition for parameters intended to be substituted into
	 *   the endpoint's URL, if any.
	 * @param options.query - An ArkType definition for parameters intended to be serialized into
	 *   the endpoint's query string, if any.
	 * @param options.request - An ArkType definition for the request body, if any.
	 * @param options.response - An ArkType definition for the response body.
	 */
	constructor(options: {
		method: HttpMethod;
		endpoint: string;
		path?: PathDef extends undefined ? undefined : type.validate<PathDef>;
		query?: QueryDef extends undefined ? undefined : type.validate<QueryDef>;
		request?: ReqDef extends undefined ? undefined : type.validate<ReqDef>;
		response: type.validate<RespDef>;
	}) {
		this.method = options.method;
		this.endpoint = options.endpoint;
		this.pathKeys = [];
		this.queryKeys = [];
		if (options.path) {
			this.path = type(options.path as never);
			this.pathKeys = Object.keys(options.path);
		}
		if (options.query) {
			this.query = type(options.query as never);
			this.queryKeys = Object.keys(options.query);
		}
		if (options.request) {
			this.request = type(options.request as never);
		}
		this.response = type(options.response as never) as never;
	}

	/**
	 * Constructs an {@link EndpointRequest} from the given parameters, validating them against
	 * the endpoint's ArkType definitions for path, query, and request body parameters.
	 *
	 * @param params - The parameters to include in the request.
	 * @returns An {@link EndpointRequest} instance.
	 */
	toRequest(params: InferEndpointArgsFromDefs<PathDef, QueryDef, ReqDef>): EndpointRequest {
		let path = this.endpoint;

		// Substitute path parameters in the endpoint URL
		if (this.path) {
			// validate params against the path type
			this.path.assert(params);

			for (const key of this.pathKeys) {
				const value = params[key as keyof typeof params];
				path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
			}
		}

		// Insert query parameters into the endpoint URL
		if (this.query) {
			// validate params against the query type
			this.query.assert(params);

			const queryParams = this.queryKeys
				.map((key) => {
					const value = params[key as keyof typeof params];
					if (value === undefined || value === null) {
						return null;
					}
					return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
				})
				.filter((param) => param !== null)
				.join("&");

			if (queryParams.length > 0) {
				path += `?${queryParams}`;
			}
		}

		// Clean up the body of keys we previously used
		let cleanBody = this.request?.onUndeclaredKey("delete").assert(params) as never;
		// Some endpoints (like the message sending) have arbitrary [string]: any keys,
		// so we explicitly delete the path and query keys from the body if they exist, to avoid sending them in the request body.
		for (const key of [...this.pathKeys, ...this.queryKeys]) {
			if (cleanBody && key in cleanBody) {
				delete cleanBody[key as keyof typeof cleanBody];
			}
		}

		return {
			method: this.method,
			path,
			body: cleanBody,
		};
	}
}
