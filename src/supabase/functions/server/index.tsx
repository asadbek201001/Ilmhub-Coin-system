import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to generate random 10-digit student ID
function generateStudentId(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// Helper function to authenticate user
async function authenticateUser(c: any) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return null;
  }
  
  // Handle demo tokens
  if (token === 'demo-admin-token') {
    return { id: 'admin-default' };
  }
  
  if (token === 'demo-teacher-token') {
    return { id: 'teacher-default' };
  }
  
  // For other tokens, try to validate with Supabase
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    
    return { id: user.id };
  } catch (error) {
    console.log('Error validating token:', error);
    return null;
  }
}

// Initialize default admin and teacher accounts
async function initializeDefaultAccounts() {
  try {
    // Check if admin exists
    const adminExists = await kv.get("user:admin-default");
    if (!adminExists) {
      const adminUser = {
        id: "admin-default",
        email: "admin@gmail.com",
        name: "System Administrator",
        role: "admin",
        createdAt: new Date().toISOString()
      };
      await kv.set("user:admin-default", adminUser);
      console.log("Default admin account created");
    }

    // Check if teacher exists
    const teacherExists = await kv.get("user:teacher-default");
    if (!teacherExists) {
      const teacherUser = {
        id: "teacher-default",
        email: "teacher@gmail.com",
        name: "Demo Teacher",
        role: "teacher",
        createdAt: new Date().toISOString()
      };
      await kv.set("user:teacher-default", teacherUser);
      console.log("Default teacher account created");
    }
  } catch (error) {
    console.log("Error initializing default accounts:", error);
  }
}

// Initialize on startup
initializeDefaultAccounts();

// Health check endpoint
app.get("/make-server-3613a76e/health", (c) => {
  return c.json({ status: "ok" });
});

// Test endpoint to check admin user
app.get("/make-server-3613a76e/test-admin", async (c) => {
  try {
    const admin = await kv.get("user:admin-default");
    const allUsers = await kv.getByPrefix("user:");
    return c.json({ 
      admin: admin,
      message: admin ? "Admin user exists" : "Admin user not found",
      totalUsers: allUsers.length,
      users: allUsers.map(u => ({ id: u.key, email: u.value.email, role: u.value.role }))
    });
  } catch (error) {
    console.log("Error checking admin:", error);
    return c.json({ error: "Failed to check admin user", errorMessage: error.message }, 500);
  }
});

// Auth endpoints
app.post("/make-server-3613a76e/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    // Store user data in KV store
    const userData = {
      id: data.user.id,
      email,
      name,
      role,
      coinBalance: role === 'student' ? 0 : undefined,
      studentId: role === 'student' ? generateStudentId() : undefined,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`user:${data.user.id}`, userData);
    
    return c.json({ user: userData });
  } catch (error) {
    console.log(`Server error during signup: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Student login with student ID
app.post("/make-server-3613a76e/login-student", async (c) => {
  try {
    const { studentId } = await c.req.json();
    
    // Find user by student ID
    const users = await kv.getByPrefix("user:");
    const user = users.find(u => u.value.studentId === studentId);
    
    if (!user) {
      return c.json({ error: "Student ID not found" }, 404);
    }
    
    return c.json({ user: user.value });
  } catch (error) {
    console.log(`Server error during student login: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Simple login for demo (admin/teacher)
app.post("/make-server-3613a76e/simple-login", async (c) => {
  try {
    console.log("Simple login endpoint called");
    const { email, password } = await c.req.json();
    console.log("Login attempt:", { email, password: password ? "[PROVIDED]" : "[MISSING]" });
    
    // Admin credentials
    if (email === "admin@gmail.com" && password === "admin1234") {
      console.log("Valid admin credentials, fetching admin user");
      let admin = await kv.get("user:admin-default");
      
      if (!admin) {
        console.log("Admin user not found, creating new one");
        const adminUser = {
          id: "admin-default",
          email: "admin@gmail.com",
          name: "System Administrator",
          role: "admin",
          createdAt: new Date().toISOString()
        };
        await kv.set("user:admin-default", adminUser);
        admin = adminUser;
      } else {
        // Update email in case it was different
        admin.email = "admin@gmail.com";
        await kv.set("user:admin-default", admin);
      }
      
      return c.json({ user: admin, token: "demo-admin-token" });
    }
    
    // Teacher credentials
    if (email === "teacher@gmail.com" && password === "teacher1234") {
      console.log("Valid teacher credentials, fetching teacher user");
      let teacher = await kv.get("user:teacher-default");
      
      if (!teacher) {
        console.log("Teacher user not found, creating new one");
        const teacherUser = {
          id: "teacher-default",
          email: "teacher@gmail.com",
          name: "Demo Teacher",
          role: "teacher",
          createdAt: new Date().toISOString()
        };
        await kv.set("user:teacher-default", teacherUser);
        teacher = teacherUser;
      } else {
        // Update email in case it was different
        teacher.email = "teacher@gmail.com";
        await kv.set("user:teacher-default", teacher);
      }
      
      return c.json({ user: teacher, token: "demo-teacher-token" });
    }
    
    console.log("Invalid credentials provided");
    return c.json({ error: "Invalid credentials" }, 401);
  } catch (error) {
    console.log(`Server error during simple login: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Add student (teacher only)
app.post("/make-server-3613a76e/add-student", async (c) => {
  try {
    const user = await authenticateUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const currentUser = await kv.get(`user:${user.id}`);
    if (!currentUser || currentUser.role !== 'teacher') {
      return c.json({ error: "Only teachers can add students" }, 403);
    }
    
    const { name, email } = await c.req.json();
    const studentId = generateStudentId();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: studentId, // Use student ID as temporary password
      user_metadata: { name, role: 'student' },
      email_confirm: true
    });
    
    if (error) {
      console.log(`Error creating student: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    const studentData = {
      id: data.user.id,
      email,
      name,
      role: 'student',
      studentId,
      coinBalance: 0,
      teacherId: user.id,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`user:${data.user.id}`, studentData);
    
    return c.json({ student: studentData });
  } catch (error) {
    console.log(`Server error during add student: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Give coins to student (teacher only)
app.post("/make-server-3613a76e/give-coins", async (c) => {
  try {
    const user = await authenticateUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const currentUser = await kv.get(`user:${user.id}`);
    if (!currentUser || currentUser.role !== 'teacher') {
      return c.json({ error: "Only teachers can give coins" }, 403);
    }
    
    const { studentId, amount, reason } = await c.req.json();
    
    // Find student
    const users = await kv.getByPrefix("user:");
    const student = users.find(u => u.value.studentId === studentId);
    
    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }
    
    // Update student's coin balance
    student.value.coinBalance += amount;
    await kv.set(`user:${student.value.id}`, student.value);
    
    // Record transaction
    const transaction = {
      id: crypto.randomUUID(),
      studentId,
      teacherId: user.id,
      amount,
      type: 'received',
      reason,
      timestamp: new Date().toISOString()
    };
    
    await kv.set(`transaction:${transaction.id}`, transaction);
    
    return c.json({ success: true, newBalance: student.value.coinBalance });
  } catch (error) {
    console.log(`Server error during give coins: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get user data
app.get("/make-server-3613a76e/user", async (c) => {
  try {
    const user = await authenticateUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }
    
    return c.json({ user: userData });
  } catch (error) {
    console.log(`Server error getting user data: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get user data by session token (for demo)
app.post("/make-server-3613a76e/get-user-by-token", async (c) => {
  try {
    const { token } = await c.req.json();
    
    if (token === 'demo-admin-token') {
      const admin = await kv.get("user:admin-default");
      if (admin) {
        return c.json({ user: admin });
      }
    }
    
    if (token === 'demo-teacher-token') {
      const teacher = await kv.get("user:teacher-default");
      if (teacher) {
        return c.json({ user: teacher });
      }
    }
    
    return c.json({ error: "Invalid token" }, 401);
  } catch (error) {
    console.log(`Server error getting user by token: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Item management
app.post("/make-server-3613a76e/add-item", async (c) => {
  try {
    const user = await authenticateUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const currentUser = await kv.get(`user:${user.id}`);
    if (!currentUser || currentUser.role !== 'admin') {
      return c.json({ error: "Only admins can add items" }, 403);
    }
    
    const { name, price, description, available } = await c.req.json();
    
    const item = {
      id: crypto.randomUUID(),
      name,
      price,
      description,
      available: available !== undefined ? available : true,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`item:${item.id}`, item);
    
    return c.json({ item });
  } catch (error) {
    console.log(`Server error adding item: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get all items
app.get("/make-server-3613a76e/items", async (c) => {
  try {
    const items = await kv.getByPrefix("item:");
    return c.json({ items: items.map(i => i.value) });
  } catch (error) {
    console.log(`Server error getting items: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Buy item (student only)
app.post("/make-server-3613a76e/buy-item", async (c) => {
  try {
    const user = await authenticateUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const currentUser = await kv.get(`user:${user.id}`);
    if (!currentUser || currentUser.role !== 'student') {
      return c.json({ error: "Only students can buy items" }, 403);
    }
    
    const { itemId } = await c.req.json();
    
    const item = await kv.get(`item:${itemId}`);
    if (!item) {
      return c.json({ error: "Item not found" }, 404);
    }
    
    if (!item.available) {
      return c.json({ error: "Item is not available" }, 400);
    }
    
    if (currentUser.coinBalance < item.price) {
      return c.json({ error: "Insufficient coins" }, 400);
    }
    
    // Update student's coin balance
    currentUser.coinBalance -= item.price;
    await kv.set(`user:${user.id}`, currentUser);
    
    // Record transaction
    const transaction = {
      id: crypto.randomUUID(),
      studentId: currentUser.studentId,
      itemId,
      amount: -item.price,
      type: 'purchase',
      itemName: item.name,
      timestamp: new Date().toISOString()
    };
    
    await kv.set(`transaction:${transaction.id}`, transaction);
    
    return c.json({ success: true, newBalance: currentUser.coinBalance });
  } catch (error) {
    console.log(`Server error during item purchase: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get student transactions
app.get("/make-server-3613a76e/transactions/:studentId", async (c) => {
  try {
    const user = await authenticateUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const studentId = c.req.param('studentId');
    const transactions = await kv.getByPrefix("transaction:");
    const studentTransactions = transactions
      .filter(t => t.value.studentId === studentId)
      .map(t => t.value)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return c.json({ transactions: studentTransactions });
  } catch (error) {
    console.log(`Server error getting transactions: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get all students (teacher/admin only)
app.get("/make-server-3613a76e/students", async (c) => {
  try {
    const user = await authenticateUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const currentUser = await kv.get(`user:${user.id}`);
    if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
      return c.json({ error: "Access denied" }, 403);
    }
    
    const users = await kv.getByPrefix("user:");
    const students = users
      .filter(u => u.value.role === 'student')
      .map(u => u.value);
    
    return c.json({ students });
  } catch (error) {
    console.log(`Server error getting students: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Add teacher (admin only)
app.post("/make-server-3613a76e/add-teacher", async (c) => {
  try {
    const user = await authenticateUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const currentUser = await kv.get(`user:${user.id}`);
    if (!currentUser || currentUser.role !== 'admin') {
      return c.json({ error: "Only admins can add teachers" }, 403);
    }
    
    const { name, email, password } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'teacher' },
      email_confirm: true
    });
    
    if (error) {
      console.log(`Error creating teacher: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    const teacherData = {
      id: data.user.id,
      email,
      name,
      role: 'teacher',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`user:${data.user.id}`, teacherData);
    
    return c.json({ teacher: teacherData });
  } catch (error) {
    console.log(`Server error during add teacher: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);