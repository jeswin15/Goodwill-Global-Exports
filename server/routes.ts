import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import "dotenv/config";
import { insertProductSchema, insertBlogSchema, insertTestimonialSchema, insertLicenseSchema } from "@shared/schema";
import { SEED_PRODUCTS, SEED_BLOGS, SEED_TESTIMONIALS, SEED_LICENSES } from "./seed_data";
import { sendContactEmail, sendQuoteEmail } from "./email";
import fs from "fs";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Middleware to disable caching for API routes
  app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
  });

  // Site Assets
  app.get("/api/assets/:id", async (req, res) => {
    try {
      const asset = await storage.getSiteAsset(req.params.id);
      if (!asset) {
        return res.status(404).send("Asset not found");
      }
      const buffer = Buffer.from(asset.base64Data, "base64");
      res.setHeader("Content-Type", asset.contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
      res.send(buffer);
    } catch (e) {
      console.error("Error serving asset:", e);
      res.status(500).send("Error serving asset");
    }
  });

  // Products
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    const categories = await storage.getCategories();
    const result = products.map(p => ({
      ...p,
      category: categories.find(c => c.id === p.categoryId)?.name || "Uncategorized",
      image: p.imageUrl,
      gallery: p.gallery || []
    }));
    res.json(result);
  });

  app.post("/api/products", async (req, res) => {
    // Determine category ID
    const categoryName = req.body.category || "Regular";
    let categories = await storage.getCategories();
    let category = categories.find(c => c.name === categoryName);

    if (!category) {
      category = await storage.createCategory({ name: categoryName });
    }

    const parsed = insertProductSchema.safeParse({
      ...req.body,
      imageUrl: req.body.image,
      categoryId: category.id,
      price: req.body.price ? parseInt(req.body.price) : null, // Ensure integer or null
      gallery: req.body.gallery || []
    });

    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const product = await storage.createProduct(parsed.data);
    res.json({
      ...product,
      category: category.name,
      image: product.imageUrl,
      gallery: product.gallery || []
    });
  });

  app.delete("/api/products/:id", async (req, res) => {
    await storage.deleteProduct(parseInt(req.params.id));
    res.status(204).end();
  });

  // Blogs
  app.get("/api/blogs", async (_req, res) => {
    const blogs = await storage.getBlogs();
    const result = blogs.map(b => ({
      ...b,
      image: b.imageUrl,
      date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
    }));
    res.json(result);
  });

  app.post("/api/blogs", async (req, res) => {
    const parsed = insertBlogSchema.safeParse({
      ...req.body,
      imageUrl: req.body.image,
      author: req.body.author || "GOODWILL GLOBAL EXPORTS", // Default author
      category: req.body.category || "General"
    });

    if (!parsed.success) {
      console.error("Blog validation failed:", JSON.stringify(parsed.error, null, 2));
      return res.status(400).json(parsed.error);
    }

    const blog = await storage.createBlog(parsed.data);
    res.json({
      ...blog,
      image: blog.imageUrl,
      date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
    });
  });

  app.delete("/api/blogs/:id", async (req, res) => {
    await storage.deleteBlog(parseInt(req.params.id));
    res.status(204).end();
  });

  // Testimonials
  app.get("/api/testimonials", async (_req, res) => {
    const testimonials = await storage.getTestimonials();
    const result = testimonials.map(t => ({
      ...t,
      image: t.imageUrl
    }));
    res.json(result);
  });

  app.post("/api/testimonials", async (req, res) => {
    const parsed = insertTestimonialSchema.safeParse({
      ...req.body,
      imageUrl: req.body.image
    });

    if (!parsed.success) {
      console.error("Testimonial validation failed:", JSON.stringify(parsed.error, null, 2));
      return res.status(400).json(parsed.error);
    }

    const testimonial = await storage.createTestimonial(parsed.data);
    res.json({
      ...testimonial,
      image: testimonial.imageUrl
    });
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    await storage.deleteTestimonial(parseInt(req.params.id));
    res.status(204).end();
  });

  // Licenses
  app.get("/api/licenses", async (_req, res) => {
    const licenses = await storage.getLicenses();
    res.json(licenses);
  });

  app.post("/api/licenses", async (req, res) => {
    const parsed = insertLicenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const license = await storage.createLicense(parsed.data);
    res.json(license);
  });

  app.patch("/api/licenses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = insertLicenseSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const license = await storage.updateLicense(id, parsed.data);
    res.json(license);
  });

  app.delete("/api/licenses/:id", async (req, res) => {
    await storage.deleteLicense(parseInt(req.params.id));
    res.status(204).end();
  });

  // Seed categories if empty
  console.log("Checking categories for seeding...");
  let categories = await storage.getCategories();
  if (categories.length === 0) {
    console.log("Seeding categories...");
    await storage.createCategory({ name: "Regular" });
    await storage.createCategory({ name: "Seasonal" });
    categories = await storage.getCategories();
  }
  console.log("Categories ready.");

  // Seed products if empty
  console.log("Checking products for seeding...");
  const products = await storage.getProducts();
  if (products.length === 0) {
    console.log("Seeding products...");
    const regularId = categories.find(c => c.name === "Regular")?.id || 1;
    const seasonalId = categories.find(c => c.name === "Seasonal")?.id || 2;

    try {
      for (const p of SEED_PRODUCTS) {
        // Updated logic to exclude 'category' field and ensure schema compliance
        const { category, ...productData } = p;
        console.log(`Seeding product: ${productData.name}`);
        await storage.createProduct({
          ...productData,
          categoryId: category === "Seasonal" ? seasonalId : regularId
        });
      }
      console.log("Products seeded successfully.");
    } catch (e) {
      console.error("Error seeding products:", e);
    }
  }
  console.log("Products ready.");

  // Email Routes
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Non-blocking email sending
      sendContactEmail({ name, email, message }).catch(err =>
        console.error("Background email error (contact):", err)
      );

      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Contact route error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  app.post("/api/quote", async (req, res) => {
    try {
      const data = req.body;
      // Basic validation
      if (!data.companyName || !data.email || !data.contactPerson) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Non-blocking email sending
      sendQuoteEmail(data).catch(err =>
        console.error("Background email error (quote):", err)
      );

      res.json({ message: "Quote request sent successfully" });
    } catch (error) {
      console.error("Quote route error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Seed blogs if empty
  console.log("Checking blogs for seeding...");
  const blogs = await storage.getBlogs();
  if (blogs.length === 0) {
    console.log("Seeding blogs...");
    try {
      for (const b of SEED_BLOGS) {
        console.log(`Seeding blog: ${b.title}`);
        await storage.createBlog(b);
      }
      console.log("Blogs seeded successfully.");
    } catch (e) {
      console.error("Error seeding blogs:", e);
    }
  }
  console.log("Blogs ready.");

  // Seed testimonials if empty
  console.log("Checking testimonials for seeding...");
  const testimonials = await storage.getTestimonials();
  if (testimonials.length === 0) {
    console.log("Seeding testimonials...");
    try {
      for (const t of SEED_TESTIMONIALS) {
        console.log(`Seeding testimonial from: ${t.name}`);
        await storage.createTestimonial(t);
      }
      console.log("Testimonials seeded successfully.");
    } catch (e) {
      console.error("Error seeding testimonials:", e);
    }
  }
  console.log("Testimonials ready.");

  // Seed licenses if empty
  // Seed licenses if empty
  console.log("Checking licenses for seeding...");
  const existingLicenses = await storage.getLicenses();
  if (existingLicenses.length === 0) {
    console.log("Seeding licenses...");
    try {
      for (const l of SEED_LICENSES) {
        await storage.createLicense(l);
      }
      console.log("Licenses seeded successfully.");
    } catch (e) {
      console.error("Error seeding licenses:", e);
    }
  }
  console.log("Licenses ready.");

  // Seed Site Assets from local images if empty
  console.log("Checking site assets for seeding...");
  try {
    const dummyAsset = await storage.getSiteAsset("hero-bg.png");
    if (!dummyAsset) {
      console.log("Seeding site assets from public/images...");
      const imagesDir = path.resolve(process.cwd(), "client/public/images");
      if (fs.existsSync(imagesDir)) {
        const files = fs.readdirSync(imagesDir);
        for (const file of files) {
          const filePath = path.join(imagesDir, file);
          if (fs.statSync(filePath).isFile()) {
            const buffer = fs.readFileSync(filePath);
            const base64Data = buffer.toString("base64");
            const ext = path.extname(file).toLowerCase();
            const contentType = ext === ".png" ? "image/png" : 
                                ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : 
                                ext === ".svg" ? "image/svg+xml" : "application/octet-stream";
            
            await storage.createSiteAsset({
              id: file,
              contentType,
              base64Data
            });
            console.log(`Seeded asset: ${file}`);
          }
        }
        console.log("Site assets seeded successfully.");
      }
    } else {
      console.log("Site assets already seeded.");
    }
  } catch (e) {
    console.error("Error seeding site assets:", e);
  }

  return httpServer;
}
