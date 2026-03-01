import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const files = pgTable('files', {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  originalName: text("original_name").notNull(),
  fileName: text("file_name").notNull(), // Cloudinary public_id
  fileUrl: text("file_url").notNull(), // Cloudinary secure_url
  fileSize: integer("file_size").notNull(), // Bytes
  mimeType: text("mime_type").notNull(),
  isOptimized: boolean("is_optimized").default(false),
  optimizedUrl: text("optimized_url"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});