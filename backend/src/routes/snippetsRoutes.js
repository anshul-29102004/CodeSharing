import { protect } from "../middleware/authMiddleware.js";
import express from 'express'
import { createSnippet, deleteSnippet, getLeaderboard, getLikedSnippets, getPopularSnippet, getPublicSnippet, getPublicSnippets, getUserSnippet, getUserSnippets, likeSnippet, updateSnippet } from "../controllers/snippets/snippetsController.js";

const router=express.Router()

router.post("/create-snippet",protect,createSnippet)
router.get("/snippets/public",getPublicSnippets)

router.get("/snippets",protect,getUserSnippets);
router.get("/snippet/:id",protect,getUserSnippet)
router.get("/snippet/public/:id",protect,getPublicSnippet)

router.patch("snippet/:id",protect,updateSnippet)
router.delete("/snippet/:id",protect,deleteSnippet)

router.patch("/snippet/like/:id",protect,likeSnippet)
router.get("/snippet/liked",protect,getLikedSnippets)

router.get("/leaderboard",protect,getLeaderboard)
router.get("/snippets/popular",getPopularSnippet)

export default router;