// Backend routes for Deskercise Dealer with Replit Auth and team functionality
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTeamSchema, insertExerciseLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupAuth(app);

  // Auth routes - Allow unauthenticated access to check auth status
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Return null if not authenticated
      if (!req.user) {
        return res.json(null);
      }
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Team routes
  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name } = insertTeamSchema.parse(req.body);
      
      const team = await storage.createTeam(name, userId);
      res.json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Failed to create team" });
    }
  });

  app.get('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teams = await storage.getUserTeams(userId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get('/api/teams/:teamId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { teamId } = req.params;
      
      // Check if user is a member of the team
      const isMember = await storage.isTeamMember(teamId, userId);
      if (!isMember) {
        return res.status(403).json({ message: "Not a member of this team" });
      }
      
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.post('/api/teams/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { inviteCode } = req.body;
      
      if (!inviteCode) {
        return res.status(400).json({ message: "Invite code is required" });
      }
      
      const team = await storage.getTeamByInviteCode(inviteCode);
      if (!team) {
        return res.status(404).json({ message: "Invalid invite code" });
      }
      
      // Check if already a member
      const isMember = await storage.isTeamMember(team.id, userId);
      if (isMember) {
        return res.status(400).json({ message: "Already a member of this team" });
      }
      
      await storage.addTeamMember(team.id, userId);
      res.json(team);
    } catch (error) {
      console.error("Error joining team:", error);
      res.status(500).json({ message: "Failed to join team" });
    }
  });

  app.delete('/api/teams/:teamId/leave', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { teamId } = req.params;
      
      const isMember = await storage.isTeamMember(teamId, userId);
      if (!isMember) {
        return res.status(400).json({ message: "Not a member of this team" });
      }
      
      await storage.removeTeamMember(teamId, userId);
      res.json({ message: "Left team successfully" });
    } catch (error) {
      console.error("Error leaving team:", error);
      res.status(500).json({ message: "Failed to leave team" });
    }
  });

  app.get('/api/teams/:teamId/members', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { teamId } = req.params;
      
      const isMember = await storage.isTeamMember(teamId, userId);
      if (!isMember) {
        return res.status(403).json({ message: "Not a member of this team" });
      }
      
      const members = await storage.getTeamMembers(teamId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get('/api/teams/:teamId/logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { teamId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      
      const isMember = await storage.isTeamMember(teamId, userId);
      if (!isMember) {
        return res.status(403).json({ message: "Not a member of this team" });
      }
      
      const logs = await storage.getTeamExerciseLogs(teamId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching team logs:", error);
      res.status(500).json({ message: "Failed to fetch team logs" });
    }
  });

  // Exercise log routes
  app.post('/api/exercise-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logData = insertExerciseLogSchema.parse({ ...req.body, userId });
      
      const log = await storage.logExercise(logData);
      res.json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error logging exercise:", error);
      res.status(500).json({ message: "Failed to log exercise" });
    }
  });

  app.get('/api/exercise-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      
      const logs = await storage.getUserExerciseLogs(userId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching exercise logs:", error);
      res.status(500).json({ message: "Failed to fetch exercise logs" });
    }
  });

  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
