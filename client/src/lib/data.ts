export interface Product {
  id: number;
  name: string;
  description: string;
  category: "Regular" | "Seasonal";
  image: string;
  gallery?: string[];
}

export interface License {
  id: number;
  title: string;
  issuer: string;
  description: string;
  image: string;
  gradient: string;
  iconColor: string;
  borderColor: string;
  badgeGradient: string;
  iconName: string;
}

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Premium Saffron Threads",
    description: "Hand-harvested, Grade A saffron threads perfect for culinary excellence. Sourced directly from our partner farms.",
    category: "Seasonal",
    image: "/images/product-spice.png"
  },
  {
    id: 2,
    name: "Golden Wheat Grains",
    description: "High-protein golden wheat grains, cleaned and processed for international export standards.",
    category: "Regular",
    image: "/images/product-grain.png"
  },
  {
    id: 3,
    name: "Organic Cardamom Pods",
    description: "Large, green, aromatic cardamom pods selected for their intense fragrance and flavor profile.",
    category: "Regular",
    image: "/images/product-spice.png"
  },
  {
    id: 4,
    name: "Royal Basmati Rice",
    description: "Extra long grain aged basmati rice, renowned for its delicate aroma and non-sticky texture.",
    category: "Regular",
    image: "/images/product-grain.png"
  },
  {
    id: 5,
    name: "Seasonal Alphonso Mangoes",
    description: "The king of mangoes, available only during peak season. Sweet, rich, and exported via air freight.",
    category: "Seasonal",
    image: "/images/hero-bg.png"
  },
  {
    id: 6,
    name: "Export Quality Cashews",
    description: "Whole W180 grade cashew nuts, processed to maintain crunch and natural sweetness.",
    category: "Regular",
    image: "/images/product-grain.png"
  }
];
