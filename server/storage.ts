import { 
  users, 
  news, 
  communities, 
  carouselSlides,
  type User, 
  type InsertUser,
  type News,
  type InsertNews,
  type Community,
  type InsertCommunity,
  type CarouselSlide,
  type InsertCarouselSlide
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // News methods
  getAllNews(): Promise<News[]>;
  createNews(insertNews: InsertNews): Promise<News>;
  
  // Community methods
  getAllCommunities(): Promise<Community[]>;
  getCommunitiesByOwner(ownerId: string): Promise<Community[]>;
  createCommunity(insertCommunity: InsertCommunity): Promise<Community>;
  updateCommunityStatus(id: string, status: string): Promise<Community | undefined>;
  
  // Carousel methods
  getActiveCarouselSlides(): Promise<CarouselSlide[]>;
  createCarouselSlide(insertSlide: InsertCarouselSlide): Promise<CarouselSlide>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllNews(): Promise<News[]> {
    return await db.select().from(news).orderBy(desc(news.createdAt));
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db
      .insert(news)
      .values(insertNews)
      .returning();
    return newsItem;
  }

  async getAllCommunities(): Promise<Community[]> {
    return await db.select().from(communities).orderBy(desc(communities.createdAt));
  }

  async getCommunitiesByOwner(ownerId: string): Promise<Community[]> {
    return await db.select().from(communities).where(eq(communities.ownerId, ownerId)).orderBy(desc(communities.createdAt));
  }

  async createCommunity(insertCommunity: InsertCommunity): Promise<Community> {
    const [community] = await db
      .insert(communities)
      .values(insertCommunity)
      .returning();
    return community;
  }

  async updateCommunityStatus(id: string, status: string): Promise<Community | undefined> {
    const [community] = await db
      .update(communities)
      .set({ status, updatedAt: new Date() })
      .where(eq(communities.id, id))
      .returning();
    return community || undefined;
  }

  async getActiveCarouselSlides(): Promise<CarouselSlide[]> {
    return await db.select().from(carouselSlides).where(eq(carouselSlides.isActive, true)).orderBy(carouselSlides.order);
  }

  async createCarouselSlide(insertSlide: InsertCarouselSlide): Promise<CarouselSlide> {
    const [slide] = await db
      .insert(carouselSlides)
      .values(insertSlide)
      .returning();
    return slide;
  }
}

export const storage = new DatabaseStorage();