import express from 'express'
import { adminMiddleware, protect } from '../middleware/authMiddleware.js';
import { bulkAddTags, createTag, deleteTag, getTagById, getTags } from '../controllers/tags/tagsController.js';

const router=express.Router();

router.post("/create-tag",protect,createTag)
router.get("/tags",getTags)
router.get("/tag/:id",getTagById)
router.delete("/tag/:id",protect,deleteTag)
router.post("/bulk-tags",protect,adminMiddleware,bulkAddTags);





export default router