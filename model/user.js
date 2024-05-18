import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name: String,
	email: { type: String, unique: true },
	properties: mongoose.Schema.Types.Mixed,
	listId: { type: mongoose.Schema.Types.ObjectId, ref: "List" },
	subscribed: { type: Boolean, default: true },
	timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
export default User;
