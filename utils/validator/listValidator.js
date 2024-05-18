import { z } from "zod";

const nestedlistPorperties = z.object({
	title: z
		.string({
			required_error: "title is required",
			invalid_type_error: "title must be a string",
		})
		.min(2, { message: "Must be 2 or more characters long" }),
	fallbackValue: z
		.string({
			required_error: "fallbackValue is required",
			invalid_type_error: "fallbackValue must be a string",
		})
		.min(2, { message: "Must be 2 or more characters long" }),
});

export const createListValidator = z.object({
	title: z
		.string({
			required_error: "title is required",
			invalid_type_error: "title must be a string",
		})
		.min(2, { message: "Must be 2 or more characters long" }),
	customProperties: z
		.array(nestedlistPorperties)
		.min(1, { message: "Array must contain at least one customProperties" }),
});
