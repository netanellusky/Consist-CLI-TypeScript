import { Router } from 'express';
// Routes

const router = Router();

router.get("/", (req, res) => {
    res.send("API is running...");
});

export default router;
