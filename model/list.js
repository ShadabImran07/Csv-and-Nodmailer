import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
	title: String,
	customProperties: [
		{
			title: String,
			fallbackValue: String,
		},
	],
	timestamp: { type: Date, default: Date.now },
});

const List = mongoose.model("List", ListSchema);
export default List;
