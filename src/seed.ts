import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db";
import User from "./models/User";
import Package from "./models/Package";

dotenv.config();

const packagesData = [
  {
    title: "Enchanting Cox's Bazar Beach Escape",
    destination: "Cox's Bazar, Bangladesh",
    category: "Beach",
    shortDescription: "Relax on the world's longest natural sea beach with stunning sunsets.",
    fullDescription:
      "Experience the golden sands and rolling waves of Cox's Bazar. This package includes beachfront accommodation, sunset boat rides, and visits to nearby Himchari and Inani beach.",
    price: 12500,
    duration: 4,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900",
    ],
    inclusions: ["Hotel accommodation", "Breakfast", "Beach bonfire", "Boat ride"],
    exclusions: ["Airfare", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrival & Beach Walk", description: "Arrive and relax at the beach in the evening." },
      { day: 2, title: "Himchari & Inani Beach Tour", description: "Full day sightseeing tour." },
      { day: 3, title: "Free Day & Water Sports", description: "Enjoy jet-skiing and parasailing." },
      { day: 4, title: "Departure", description: "Check out and departure." },
    ],
    rating: 4.6,
    reviewCount: 3,
  },
  {
    title: "Sajek Valley Cloud Adventure",
    destination: "Sajek Valley, Bangladesh",
    category: "Mountain",
    shortDescription: "Walk above the clouds in the 'Queen of Hills' Sajek Valley.",
    fullDescription:
      "Sajek Valley offers breathtaking cloud views, tribal culture, and cool mountain air. Stay in cottages overlooking the valley and enjoy bonfire nights under the stars.",
    price: 9800,
    duration: 3,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900",
    ],
    inclusions: ["Cottage stay", "All meals", "Local guide", "Bonfire"],
    exclusions: ["Transport to Khagrachari", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrival at Sajek", description: "Check-in and evening cloud viewing." },
      { day: 2, title: "Sunrise & Village Tour", description: "Sunrise point visit and tribal village walk." },
      { day: 3, title: "Departure", description: "Morning views and departure." },
    ],
    rating: 4.8,
    reviewCount: 5,
  },
  {
    title: "Sundarbans Mangrove Wildlife Safari",
    destination: "Sundarbans, Bangladesh",
    category: "Wildlife",
    shortDescription: "Explore the largest mangrove forest and spot the Royal Bengal Tiger's territory.",
    fullDescription:
      "A guided boat safari through the Sundarbans, home to the Royal Bengal Tiger, spotted deer, and countless bird species. Includes river cruising and forest station visits.",
    price: 15500,
    duration: 3,
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900",
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=900",
    ],
    inclusions: ["Boat cruise", "All meals", "Forest permit", "Guide"],
    exclusions: ["Personal expenses", "Camera permit"],
    itinerary: [
      { day: 1, title: "Boat Departure", description: "Board the cruise and start river journey." },
      { day: 2, title: "Forest Station Visits", description: "Visit Kotka and Kochikhali forest stations." },
      { day: 3, title: "Return Journey", description: "Sail back and departure." },
    ],
    rating: 4.7,
    reviewCount: 4,
  },
  {
    title: "Bandarban Hill Trekking Expedition",
    destination: "Bandarban, Bangladesh",
    category: "Adventure",
    shortDescription: "Trek through the highest peaks and waterfalls of Bandarban hill tracts.",
    fullDescription:
      "An adventurous trekking package covering Nilgiri, Nafakhum waterfall, and Boga Lake. Perfect for adventure seekers who want to explore Bangladesh's highest terrain.",
    price: 11000,
    duration: 4,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=900",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=900",
    ],
    inclusions: ["Resort stay", "Trekking guide", "All meals", "Permits"],
    exclusions: ["Transport to Bandarban town", "Personal gear"],
    itinerary: [
      { day: 1, title: "Arrival & Nilgiri", description: "Check-in and visit Nilgiri hill." },
      { day: 2, title: "Boga Lake Trek", description: "Trek to the mystical Boga Lake." },
      { day: 3, title: "Nafakhum Waterfall", description: "Boat and trek to Nafakhum waterfall." },
      { day: 4, title: "Departure", description: "Return journey and departure." },
    ],
    rating: 4.5,
    reviewCount: 2,
  },
  {
    title: "Srimangal Tea Garden Retreat",
    destination: "Srimangal, Bangladesh",
    category: "Nature",
    shortDescription: "Wander through endless green tea gardens and taste the famous seven-layer tea.",
    fullDescription:
      "Explore the tea capital of Bangladesh with visits to tea estates, Lawachara National Park, and the famous seven-layer tea experience.",
    price: 8500,
    duration: 2,
    images: [
      "https://images.unsplash.com/photo-1600100397608-f9d6d3634f5c?w=900",
      "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=900",
    ],
    inclusions: ["Resort stay", "Breakfast", "Tea garden tour", "Park entry"],
    exclusions: ["Lunch & dinner", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Tea Garden Tour", description: "Visit multiple tea estates and factories." },
      { day: 2, title: "Lawachara National Park", description: "Nature walk and departure." },
    ],
    rating: 4.4,
    reviewCount: 6,
  },
  {
    title: "Saint Martin Island Getaway",
    destination: "Saint Martin, Bangladesh",
    category: "Beach",
    shortDescription: "Discover the only coral island of Bangladesh with crystal clear waters.",
    fullDescription:
      "A relaxing island getaway to Saint Martin featuring snorkeling, cycling around the island, and fresh seafood by the beach.",
    price: 14000,
    duration: 3,
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900",
    ],
    inclusions: ["Ship ticket", "Hotel stay", "Breakfast", "Island tour"],
    exclusions: ["Lunch & dinner", "Snorkeling gear rental"],
    itinerary: [
      { day: 1, title: "Ship Journey & Arrival", description: "Travel by ship and check-in." },
      { day: 2, title: "Island Exploration", description: "Cycle around and snorkel." },
      { day: 3, title: "Return Journey", description: "Departure back to mainland." },
    ],
    rating: 4.9,
    reviewCount: 8,
  },
];

const seedData = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await User.deleteMany({});
  await Package.deleteMany({});

  console.log("Creating demo users...");
  const adminUser = await User.create({
    name: "Admin User",
    email: "admin@tournest.com",
    password: "admin123",
    role: "admin",
  });

  const demoUser = await User.create({
    name: "Demo Traveler",
    email: "user@tournest.com",
    password: "user1234",
    role: "user",
  });

  console.log("Seeding travel packages...");
  const packagesWithOwner = packagesData.map((pkg) => ({ ...pkg, createdBy: adminUser._id }));
  await Package.insertMany(packagesWithOwner);

  console.log("Seed complete!");
  console.log("Admin login -> email: admin@tournest.com | password: admin123");
  console.log("User login  -> email: user@tournest.com  | password: user1234");

  await mongoose.disconnect();
  process.exit(0);
};

seedData().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
