import List from "../../model/list.js";
import { createListValidator } from "../../utils/validator/listValidator.js";

export const createList = async (req, res) => {
	try {
		const result = createListValidator.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json({
				status: false,
				errors: {
					message: result.error.issues[0].message,
					code: "INVALID_INPUT",
				},
			});
		}
		const { title, customProperties } = req.body;
		const newList = new List({
			title,
			customProperties,
		});
		await newList.save();
		return res.status(201).json({ status: true, data: newList });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
