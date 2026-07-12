import mongoose, { Document, Schema } from "mongoose";

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface IPackage extends Document {
  title: string;
  destination: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  duration: number; // days
  images: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: IItineraryDay[];
  rating: number;
  reviewCount: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const packageSchema = new Schema<IPackage>(
  {
    title: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 },
    images: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    itinerary: {
      type: [
        {
          day: Number,
          title: String,
          description: String,
        },
      ],
      default: [],
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

packageSchema.index({ title: "text", destination: "text", category: "text" });

export default mongoose.model<IPackage>("Package", packageSchema);
