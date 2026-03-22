import { type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type Blog, type InsertBlog, type Testimonial, type InsertTestimonial, type License, type InsertLicense, type SiteAsset, type InsertSiteAsset, users, categories, products, blogs, testimonials, siteAssets, licenses } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  getBlogs(): Promise<Blog[]>;
  getBlog(id: number): Promise<Blog | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  deleteBlog(id: number): Promise<void>;

  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<void>;

  getSiteAsset(id: string): Promise<SiteAsset | undefined>;
  createSiteAsset(asset: InsertSiteAsset): Promise<SiteAsset>;

  getLicenses(): Promise<License[]>;
  getLicense(id: number): Promise<License | undefined>;
  createLicense(license: InsertLicense): Promise<License>;
  updateLicense(id: number, license: Partial<InsertLicense>): Promise<License>;
  deleteLicense(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private blogs: Map<number, Blog>;
  private testimonials: Map<number, Testimonial>;
  private licenses: Map<number, License>;
  private siteAssets: Map<string, SiteAsset>;
  private currentId: { users: number; categories: number; products: number; blogs: number; testimonials: number; licenses: number };

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.blogs = new Map();
    this.testimonials = new Map();
    this.licenses = new Map();
    this.siteAssets = new Map();
    this.currentId = { users: 1, categories: 1, products: 1, blogs: 1, testimonials: 1, licenses: 1 };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentId.categories++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId.products++;
    const product: Product = {
      ...insertProduct,
      id,
      price: insertProduct.price ?? null,
      gallery: insertProduct.gallery ?? null
    };
    this.products.set(id, product);
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }

  async getBlogs(): Promise<Blog[]> {
    return Array.from(this.blogs.values());
  }

  async getBlog(id: number): Promise<Blog | undefined> {
    return this.blogs.get(id);
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const id = this.currentId.blogs++;
    const blog: Blog = {
      ...insertBlog,
      category: insertBlog.category || "General",
      id: id,
      createdAt: new Date()
    };
    this.blogs.set(id, blog);
    return blog;
  }

  async deleteBlog(id: number): Promise<void> {
    this.blogs.delete(id);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentId.testimonials++;
    const testimonial: Testimonial = { ...insertTestimonial, id: id, createdAt: new Date() };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async deleteTestimonial(id: number): Promise<void> {
    this.testimonials.delete(id);
  }

  async getSiteAsset(id: string): Promise<SiteAsset | undefined> {
    return this.siteAssets.get(id);
  }

  async createSiteAsset(insertAsset: InsertSiteAsset): Promise<SiteAsset> {
    const asset: SiteAsset = { ...insertAsset };
    this.siteAssets.set(asset.id, asset);
    return asset;
  }

  async getLicenses(): Promise<License[]> {
    return Array.from(this.licenses.values());
  }

  async getLicense(id: number): Promise<License | undefined> {
    return this.licenses.get(id);
  }

  async createLicense(insertLicense: InsertLicense): Promise<License> {
    const id = this.currentId.licenses++;
    const license: License = {
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      badgeGradient: "from-blue-500 to-cyan-500",
      iconName: "ShieldCheck",
      ...insertLicense,
      id
    };
    this.licenses.set(id, license);
    return license;
  }

  async updateLicense(id: number, update: Partial<InsertLicense>): Promise<License> {
    const existing = this.licenses.get(id);
    if (!existing) throw new Error("License not found");
    const updated = { ...existing, ...update };
    this.licenses.set(id, updated);
    return updated;
  }

  async deleteLicense(id: number): Promise<void> {
    this.licenses.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not initialized");
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    if (!db) throw new Error("Database not initialized");
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async getProducts(): Promise<Product[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    if (!db) throw new Error("Database not initialized");
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    if (!db) throw new Error("Database not initialized");
    await db.delete(products).where(eq(products.id, id));
  }

  async getBlogs(): Promise<Blog[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(blogs);
  }

  async getBlog(id: number): Promise<Blog | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    return blog;
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    if (!db) throw new Error("Database not initialized");
    const [blog] = await db.insert(blogs).values(insertBlog).returning();
    return blog;
  }

  async deleteBlog(id: number): Promise<void> {
    if (!db) throw new Error("Database not initialized");
    await db.delete(blogs).where(eq(blogs.id, id));
  }

  async getTestimonials(): Promise<Testimonial[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(testimonials);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    if (!db) throw new Error("Database not initialized");
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }

  async deleteTestimonial(id: number): Promise<void> {
    if (!db) throw new Error("Database not initialized");
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  async getSiteAsset(id: string): Promise<SiteAsset | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [asset] = await db.select().from(siteAssets).where(eq(siteAssets.id, id));
    return asset;
  }

  async createSiteAsset(insertAsset: InsertSiteAsset): Promise<SiteAsset> {
    if (!db) throw new Error("Database not initialized");
    const [asset] = await db.insert(siteAssets).values(insertAsset).returning();
    return asset;
  }

  async getLicenses(): Promise<License[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(licenses);
  }

  async getLicense(id: number): Promise<License | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [license] = await db.select().from(licenses).where(eq(licenses.id, id));
    return license;
  }

  async createLicense(insertLicense: InsertLicense): Promise<License> {
    if (!db) throw new Error("Database not initialized");
    const [license] = await db.insert(licenses).values(insertLicense).returning();
    return license;
  }

  async updateLicense(id: number, update: Partial<InsertLicense>): Promise<License> {
    if (!db) throw new Error("Database not initialized");
    const [license] = await db.update(licenses).set(update).where(eq(licenses.id, id)).returning();
    if (!license) throw new Error("License not found");
    return license;
  }

  async deleteLicense(id: number): Promise<void> {
    if (!db) throw new Error("Database not initialized");
    await db.delete(licenses).where(eq(licenses.id, id));
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
