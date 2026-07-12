import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  packageId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);
