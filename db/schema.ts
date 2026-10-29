import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const surveyResponses = sqliteTable("survey_responses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  audience: text("audience").notNull(),
  answers: text("answers").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
