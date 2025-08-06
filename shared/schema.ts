import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("comunidad"), // "administrador" or "comunidad"
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  authorId: varchar("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const communities = pgTable("communities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // "solar", "eolica", "hidraulica", "biomasa", "mixta"
  location: text("location").notNull(),
  capacity: integer("capacity").notNull(), // in kW
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "approved", "rejected"
  ownerId: varchar("owner_id").references(() => users.id),
  documents: jsonb("documents"), // Store file paths/urls
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const carouselSlides = pgTable("carousel_slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  icon: text("icon").notNull(),
  backgroundColor: text("background_color").notNull(),
  order: integer("order").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  news: many(news),
  communities: many(communities),
}));

export const newsRelations = relations(news, ({ one }) => ({
  author: one(users, { fields: [news.authorId], references: [users.id] }),
}));

export const communitiesRelations = relations(communities, ({ one }) => ({
  owner: one(users, { fields: [communities.ownerId], references: [users.id] }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCarouselSlideSchema = createInsertSchema(carouselSlides).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type Community = typeof communities.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type CarouselSlide = typeof carouselSlides.$inferSelect;
export type InsertCarouselSlide = z.infer<typeof insertCarouselSlideSchema>;
