import express from "express";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GET /api/providers/checkout - Get checkout providers
router.get("/checkout", async (req, res) => {
  try {
    const filePath = join(__dirname, "..", "data", "checkout-providers.json");
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    
    res.json({ success: true, data: data.providers });
  } catch (error) {
    console.error("Error reading checkout providers:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to load checkout providers" 
    });
  }
});

export default router;
