import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Blog posts
  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.get("/api/posts/:id", async (req, res) => {
    const post = await storage.getPost(Number(req.params.id));
    if (!post) return res.sendStatus(404);
    res.json(post);
  });

  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const parsed = insertPostSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const post = await storage.createPost({
      ...parsed.data,
      authorId: req.user!.id,
    });
    res.status(201).json(post);
  });

  app.delete("/api/posts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const post = await storage.getPost(Number(req.params.id));
    if (!post) return res.sendStatus(404);
    if (post.authorId !== req.user!.id && req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    await storage.deletePost(post.id);
    res.sendStatus(204);
  });

  // Comments
  app.get("/api/posts/:id/comments", async (req, res) => {
    const comments = await storage.getComments(Number(req.params.id));
    res.json(comments);
  });

  app.post("/api/posts/:id/comments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertCommentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const post = await storage.getPost(Number(req.params.id));
    if (!post) return res.sendStatus(404);

    const comment = await storage.createComment({
      ...parsed.data,
      postId: post.id,
      authorId: req.user!.id,
    });
    res.status(201).json(comment);
  });

  // External API integration
  app.get("/api/external-users", async (_req, res) => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!response.ok) throw new Error("Failed to fetch external users");
      const users = await response.json();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch external users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
