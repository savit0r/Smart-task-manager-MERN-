import express from "express";
import Task from "../models/task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all task routes
router.use(authMiddleware);

// POST /tasks -> create task
router.post("/", async (req, res) => {
    try {
        const { title, status } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const task = await Task.create({
            title,
            status: status || "pending",
            userId: req.userId,
        });

        return res.status(201).json(task);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

// GET /tasks -> fetch user tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
        return res.json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

// PUT /tasks/:id -> update task (only own task)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status } = req.body;

        // Ensure we only update tasks belonging to this user
        const task = await Task.findOne({ _id: id, userId: req.userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (title !== undefined) task.title = title;
        if (status !== undefined) task.status = status;

        const updatedTask = await task.save();

        return res.json(updatedTask);
    } catch (error) {
        console.error(error);
        // Handle invalid ObjectId
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid task id" });
        }
        return res.status(500).json({ message: "Server error" });
    }
});

// DELETE /tasks/:id -> delete task (only own task)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid task id" });
        }
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;

