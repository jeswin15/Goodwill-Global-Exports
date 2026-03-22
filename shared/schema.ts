import { sql } from "drizzle-orm";
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const siteAssets = pgTable("site_assets", {
  id: text("id").primaryKey(),
  contentType: text("content_type").notNull(),
  base64Data: text("base64_data").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price"), // Optional price, maybe in cents
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull(),
  gallery: text("gallery").array(),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull().default("General"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  // UI fields for consistency with existing design
  gradient: text("gradient").notNull().default("from-blue-500/20 to-cyan-500/20"),
  iconColor: text("icon_color").notNull().default("text-blue-600"),
  borderColor: text("border_color").notNull().default("border-blue-200"),
  badgeGradient: text("badge_gradient").notNull().default("from-blue-500 to-cyan-500"),
  iconName: text("icon_name").notNull().default("ShieldCheck"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  createdAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertLicenseSchema = createInsertSchema(licenses).omit({
  id: true,
});

export const insertSiteAssetSchema = createInsertSchema(siteAssets);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Blog = typeof blogs.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type License = typeof licenses.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertLicense = z.infer<typeof insertLicenseSchema>;
export type SiteAsset = typeof siteAssets.$inferSelect;
export type InsertSiteAsset = z.infer<typeof insertSiteAssetSchema>;
