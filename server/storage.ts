import {
  users,
  teams,
  teamMembers,
  exerciseLogs,
  type User,
  type UpsertUser,
  type Team,
  type InsertTeam,
  type TeamMember,
  type ExerciseLog,
  type InsertExerciseLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

// Storage interface for all database operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserAvatar(userId: string, avatarEmoji: string): Promise<User>;
  
  // Team operations
  createTeam(name: string, createdById: string): Promise<Team>;
  getTeam(id: string): Promise<Team | undefined>;
  getTeamByInviteCode(inviteCode: string): Promise<Team | undefined>;
  getUserTeams(userId: string): Promise<Team[]>;
  
  // Team member operations
  addTeamMember(teamId: string, userId: string): Promise<TeamMember>;
  removeTeamMember(teamId: string, userId: string): Promise<void>;
  getTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]>;
  isTeamMember(teamId: string, userId: string): Promise<boolean>;
  
  // Exercise log operations
  logExercise(log: InsertExerciseLog): Promise<ExerciseLog>;
  getUserExerciseLogs(userId: string, limit?: number): Promise<ExerciseLog[]>;
  getTeamExerciseLogs(teamId: string, limit?: number): Promise<(ExerciseLog & { user: User })[]>;
  getUserStats(userId: string): Promise<{ total: number; streak: number }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserAvatar(userId: string, avatarEmoji: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        avatarEmoji,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Team operations
  async createTeam(name: string, createdById: string): Promise<Team> {
    const inviteCode = randomBytes(8).toString('hex');
    const [team] = await db
      .insert(teams)
      .values({
        name,
        inviteCode,
        createdById,
      })
      .returning();
    
    // Automatically add creator as team member
    await this.addTeamMember(team.id, createdById);
    
    return team;
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getTeamByInviteCode(inviteCode: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.inviteCode, inviteCode));
    return team;
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    const result = await db
      .select({ team: teams })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, userId));
    
    return result.map(r => r.team);
  }

  // Team member operations
  async addTeamMember(teamId: string, userId: string): Promise<TeamMember> {
    const [member] = await db
      .insert(teamMembers)
      .values({ teamId, userId })
      .returning();
    return member;
  }

  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    await db
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, userId)
        )
      );
  }

  async getTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]> {
    const result = await db
      .select({
        member: teamMembers,
        user: users,
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId));
    
    return result.map(r => ({ ...r.member, user: r.user }));
  }

  async isTeamMember(teamId: string, userId: string): Promise<boolean> {
    const [member] = await db
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, userId)
        )
      );
    return !!member;
  }

  // Exercise log operations
  async logExercise(log: InsertExerciseLog): Promise<ExerciseLog> {
    const [exerciseLog] = await db
      .insert(exerciseLogs)
      .values(log)
      .returning();
    return exerciseLog;
  }

  async getUserExerciseLogs(userId: string, limit: number = 100): Promise<ExerciseLog[]> {
    return await db
      .select()
      .from(exerciseLogs)
      .where(eq(exerciseLogs.userId, userId))
      .orderBy(desc(exerciseLogs.completedAt))
      .limit(limit);
  }

  async getTeamExerciseLogs(teamId: string, limit: number = 100): Promise<(ExerciseLog & { user: User })[]> {
    const result = await db
      .select({
        log: exerciseLogs,
        user: users,
      })
      .from(exerciseLogs)
      .innerJoin(users, eq(exerciseLogs.userId, users.id))
      .innerJoin(teamMembers, eq(users.id, teamMembers.userId))
      .where(eq(teamMembers.teamId, teamId))
      .orderBy(desc(exerciseLogs.completedAt))
      .limit(limit);
    
    return result.map(r => ({ ...r.log, user: r.user }));
  }

  async getUserStats(userId: string): Promise<{ total: number; streak: number }> {
    // Get total completed exercises
    const totalResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(exerciseLogs)
      .where(
        and(
          eq(exerciseLogs.userId, userId),
          eq(exerciseLogs.status, 'completed')
        )
      );
    
    const total = totalResult[0]?.count || 0;
    
    // Calculate streak (consecutive days with at least one completed exercise)
    const logs = await db
      .select({
        date: sql<string>`DATE(${exerciseLogs.completedAt})`,
      })
      .from(exerciseLogs)
      .where(
        and(
          eq(exerciseLogs.userId, userId),
          eq(exerciseLogs.status, 'completed')
        )
      )
      .orderBy(desc(exerciseLogs.completedAt));
    
    const uniqueDates = Array.from(new Set(logs.map(l => l.date)));
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const expectedDate = checkDate.toISOString().split('T')[0];
      
      if (uniqueDates.includes(expectedDate)) {
        streak++;
      } else {
        break;
      }
    }
    
    return { total, streak };
  }
}

export const storage = new DatabaseStorage();
