import { Response } from "express";
import Package from "../models/Package";
import Review from "../models/Review";
import { AuthRequest } from "../types";

// GET /api/packages - list with search, filter, sort, pagination
export const getPackages = async (req: AuthRequest, res: Response) => {
  try {
    const {
      search,
      category,
      destination,
      minPrice,
      maxPrice,
      sort,
      page = "1",
      limit = "8",
    } = req.query as Record<string, string>;

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (destination) query.destination = { $regex: destination, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.max(parseInt(limit) || 8, 1);
    const skip = (pageNum - 1) * limitNum;

    const [packages, total] = await Promise.all([
      Package.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Package.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: packages,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch packages", error: (error as Error).message });
  }
};

// GET /api/packages/featured
export const getFeaturedPackages = async (_req: AuthRequest, res: Response) => {
  try {
    const packages = await Package.find().sort({ rating: -1 }).limit(6);
    res.status(200).json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch featured packages", error: (error as Error).message });
  }
};

// GET /api/packages/:id
export const getPackageById = async (req: AuthRequest, res: Response) => {
  try {
    const pkg = await Package.findById(req.params.id).populate("createdBy", "name email");
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    const relatedPackages = await Package.find({
      _id: { $ne: pkg._id },
      category: pkg.category,
    }).limit(4);

    const reviews = await Review.find({ packageId: pkg._id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: pkg, related: relatedPackages, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch package", error: (error as Error).message });
  }
};

// POST /api/packages
export const createPackage = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      destination,
      category,
      shortDescription,
      fullDescription,
      price,
      duration,
      images,
      inclusions,
      exclusions,
      itinerary,
    } = req.body;

    if (!title || !destination || !category || !shortDescription || !fullDescription || !price || !duration) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const newPackage = await Package.create({
      title,
      destination,
      category,
      shortDescription,
      fullDescription,
      price,
      duration,
      images: images && images.length ? images : ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800"],
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      itinerary: itinerary || [],
      createdBy: req.user?.id,
    });

    res.status(201).json({ success: true, message: "Package created successfully", data: newPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create package", error: (error as Error).message });
  }
};

// GET /api/packages/manage/my
export const getMyPackages = async (req: AuthRequest, res: Response) => {
  try {
    const packages = await Package.find({ createdBy: req.user?.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch your packages", error: (error as Error).message });
  }
};

// DELETE /api/packages/:id
export const deletePackage = async (req: AuthRequest, res: Response) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    if (pkg.createdBy.toString() !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this package" });
    }
    await pkg.deleteOne();
    res.status(200).json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete package", error: (error as Error).message });
  }
};

// POST /api/packages/:id/reviews
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment, userName } = req.body;
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment are required" });
    }

    const review = await Review.create({
      packageId: pkg._id,
      userId: req.user?.id,
      userName: userName || "Anonymous Traveler",
      rating,
      comment,
    });

    const allReviews = await Review.find({ packageId: pkg._id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    pkg.rating = Math.round(avgRating * 10) / 10;
    pkg.reviewCount = allReviews.length;
    await pkg.save();

    res.status(201).json({ success: true, message: "Review added successfully", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add review", error: (error as Error).message });
  }
};
