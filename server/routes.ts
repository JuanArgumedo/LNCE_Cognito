import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string; username: string };
}

// Middleware to verify JWT token
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const requireAdmin = (req: AuthenticatedRequest, res: Response, next: Function) => {
  if (req.user?.role !== 'administrador') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, email, password, name, role = 'comunidad' } = req.body;
      
      if (!username || !email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        name,
        role
      });

      const token = jwt.sign(
        { id: user.id, role: user.role, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // News routes
  app.get('/api/news', async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      console.error('Get news error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/news', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { title, content, excerpt, category, imageUrl } = req.body;
      
      if (!title || !content || !excerpt || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const news = await storage.createNews({
        title,
        content,
        excerpt,
        category,
        imageUrl,
        authorId: req.user!.id
      });

      res.status(201).json(news);
    } catch (error) {
      console.error('Create news error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Community routes
  app.get('/api/communities', authenticateToken, async (req, res) => {
    try {
      let communities;
      if (req.user!.role === 'administrador') {
        communities = await storage.getAllCommunities();
      } else {
        communities = await storage.getCommunitiesByOwner(req.user!.id);
      }
      res.json(communities);
    } catch (error) {
      console.error('Get communities error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/communities', authenticateToken, upload.fields([
    { name: 'technical_study', maxCount: 1 },
    { name: 'economic_analysis', maxCount: 1 },
    { name: 'legal_docs', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { name, type, location, capacity, description } = req.body;
      
      if (!name || !type || !location || !capacity || !description) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const documents: { [key: string]: string } = {};
      
      if (files) {
        Object.keys(files).forEach(key => {
          if (files[key] && files[key][0]) {
            documents[key] = files[key][0].path;
          }
        });
      }

      const community = await storage.createCommunity({
        name,
        type,
        location,
        capacity: parseInt(capacity),
        description,
        ownerId: req.user!.id,
        documents,
        status: 'pending'
      });

      res.status(201).json(community);
    } catch (error) {
      console.error('Create community error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.patch('/api/communities/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const community = await storage.updateCommunityStatus(id, status);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      res.json(community);
    } catch (error) {
      console.error('Update community status error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Carousel routes
  app.get('/api/carousel', async (req, res) => {
    try {
      const slides = await storage.getActiveCarouselSlides();
      res.json(slides);
    } catch (error) {
      console.error('Get carousel error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/carousel', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { title, content, icon, backgroundColor, order } = req.body;
      
      if (!title || !content || !icon || !backgroundColor || order === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const slide = await storage.createCarouselSlide({
        title,
        content,
        icon,
        backgroundColor,
        order,
        isActive: true
      });

      res.status(201).json(slide);
    } catch (error) {
      console.error('Create carousel slide error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Protected route to verify token
  app.get('/api/auth/verify', authenticateToken, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });

  const httpServer = createServer(app);
  return httpServer;
}
