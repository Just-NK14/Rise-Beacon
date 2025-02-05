import { integer, varchar, pgTable, serial, text, timestamp, jsonb, boolean} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table (Volunteers, Organizations, Schools)
export const Users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull(), // volunteer, organization, school
    governmentId: varchar("government_id", { length: 50 }).unique(), // Aadhar, PAN, etc.
    isVerified: boolean("is_verified").notNull().default(false),
    schoolId: integer("school_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schools table
export const Schools = pgTable("schools", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    contactInfo: text("contact_info"),
    isVerified: boolean("is_verified").notNull().default(false),
});

// Organizations table
export const Organizations = pgTable("organizations", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    contactInfo: text("contact_info"),
    registrationDocument: text("registration_document"), // File URL or ID
    isVerified: boolean("is_verified").notNull().default(false),
});

// Volunteer Opportunities table
export const VolunteerOpportunities = pgTable("volunteer_opportunities", {
    id: serial("id").primaryKey(),
    organizationId: integer("organization_id").references(() => Organizations.id).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    minAge: integer('min_age').notNull().default(13),
    location: text("location"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    status: varchar("status", { length: 50 }).notNull().default("open"), // open, closed, ongoing
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Applications table
export const Applications = pgTable("applications", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => Users.id).notNull(),
    opportunityId: integer("opportunity_id").references(() => VolunteerOpportunities.id).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, accepted, rejected, completed
    appliedAt: timestamp("applied_at").defaultNow().notNull(),
});

// Rewards table
export const Rewards = pgTable("rewards", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => Users.id).notNull(),
    points: integer("points").notNull().default(0),
    level: integer("level").notNull().default(1),
    isAvailable: boolean("is_available").notNull().default(true),
    description: text("description"),
    name: varchar("name", { length: 255 }).notNull(),
    collectionInfo: text("collection_info").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transactions table (For reward points)
export const Transactions = pgTable("transactions", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => Users.id).notNull(),
    type: varchar("type", { length: 20 }).notNull(), // 'earned' or 'redeemed'
    amount: integer("amount").notNull(),
    description: text("description").notNull(),
    date: timestamp("date").defaultNow().notNull(),
});

// Notifications table
export const Notifications = pgTable("notifications", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => Users.id).notNull(),
    message: text("message").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(Users, ({ one }) => ({
    school: one(Schools, { fields: [Users.schoolId], references: [Schools.id] }),
}));

//Aniket is gay