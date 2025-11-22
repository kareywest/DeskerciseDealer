import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  unique,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  avatarEmoji: varchar("avatar_emoji", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users);
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

// Teams table
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  inviteCode: varchar("invite_code", { length: 20 }).notNull().unique(),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
});
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

// Team members junction table
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => ({
  uniqueMembership: unique("unique_team_user").on(table.teamId, table.userId),
}));

export type TeamMember = typeof teamMembers.$inferSelect;

// Exercise logs table
export const exerciseLogs = pgTable("exercise_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  exerciseName: varchar("exercise_name", { length: 100 }).notNull(),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'completed' or 'skipped'
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertExerciseLogSchema = createInsertSchema(exerciseLogs).omit({
  id: true,
  completedAt: true,
});
export type InsertExerciseLog = z.infer<typeof insertExerciseLogSchema>;
export type ExerciseLog = typeof exerciseLogs.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  teamMemberships: many(teamMembers),
  createdTeams: many(teams),
  exerciseLogs: many(exerciseLogs),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  creator: one(users, {
    fields: [teams.createdById],
    references: [users.id],
  }),
  members: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const exerciseLogsRelations = relations(exerciseLogs, ({ one }) => ({
  user: one(users, {
    fields: [exerciseLogs.userId],
    references: [users.id],
  }),
}));
