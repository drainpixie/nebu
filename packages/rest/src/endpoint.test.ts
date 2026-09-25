import { describe, test, expect, assertType } from "vitest";
import { type EndpointRequest, Endpoint } from "./endpoint.js";

describe("Endpoint", () => {
	describe("toRequest", () => {
		test("handles a simple endpoint with no parameters", () => {
			const e = new Endpoint({
				method: "GET",
				endpoint: "/test",
				response: { ok: "boolean" },
			});

			const req = e.toRequest({});

			expect(req).toEqual<EndpointRequest>({
				method: "GET",
				path: "/test",
			});
		});

		test("properly assigns request body, path, and query parameters", () => {
			const e = new Endpoint({
				method: "POST",

				endpoint: "/test/{path1}/{path2}",
				path: {
					path1: "string",
					path2: "string",
				},
				query: {
					query1: "string",
					query2: "boolean",
				},
				request: {
					body1: "string",
					body2: "number",
				},

				response: { ok: "boolean" },
			});

			assertType<
				(params: {
					path1: string;
					path2: string;
					query1: string;
					query2: boolean;
					body1: string;
					body2: number;
				}) => any
			>(e.toRequest);

			const req = e.toRequest({
				path1: "path1",
				path2: "path2",
				query1: "query1",
				query2: true,
				body1: "body1",
				body2: 42,
			});

			expect(req).toEqual<EndpointRequest>({
				method: "POST",
				path: "/test/path1/path2?query1=query1&query2=true",
				body: {
					body1: "body1",
					body2: 42,
				},
			});
		});

		test("properly URL-escapes path and query parameters", () => {
			const e = new Endpoint({
				method: "POST",

				endpoint: "/test/{path}",
				path: {
					path: "string",
				},
				query: {
					query: "string",
				},

				response: {},
			});

			const req = e.toRequest({
				path: "test & test",
				query: "test / test",
			});

			expect(req).toEqual<EndpointRequest>({
				method: "POST",
				path: "/test/test%20%26%20test?query=test%20%2F%20test",
			});
		});

		test("rejects invalid types on inputs at runtime", () => {
			const e = new Endpoint({
				method: "POST",

				endpoint: "/test",
				request: {
					body: "string",
				},

				response: {},
			});

			expect(() => {
				e.toRequest({
					// @ts-expect-error
					body: 42,
				});
			}).toThrowErrorMatchingInlineSnapshot(
				"[TraversalError: body must be a string (was a number)]",
			);
		});

		test("rejects missing required parameters at runtime", () => {
			const e = new Endpoint({
				method: "POST",

				endpoint: "/test/{path}",
				path: {
					path: "string",
				},

				response: {},
			});

			expect(() => {
				// @ts-expect-error
				e.toRequest({});
			}).toThrowErrorMatchingInlineSnapshot(
				"[TraversalError: path must be a string (was missing)]",
			);
		});
	});
});
