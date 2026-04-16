"use strict";

const express = require("express");
const Posts = require("../models/posts");

const router = express.Router();

// 로그인 체크 미들웨어
function requireLogin(req, res, next) {
  if (req.session && req.session.isAuthenticated) return next();
  return res.redirect("/login");
}

// getPosts(req, res)
async function getPosts(req, res) {
    try {
      const posts = await Posts.find({}).sort({ createdAt: -1 });
  
      return res.render("main", {
        username: req.session.user.id,
        roles: req.session.user.roles || [],
        posts,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
  }
  
// showNewPost(req, res)
function showNewPost(req, res) {
    return res.render("newpost", {
      username: req.session.user.id,
      roles: req.session.user.roles || [],
      error: null,
    });
}
  
// createPost(req, res)
async function createPost(req, res) {
    try {
      const content = (req.body.content || "").trim();
  
      if (!content) {
        return res.status(400).render("newpost", {
          username: req.session.user.id,
          roles: req.session.user.roles || [],
          error: "Content cannot be empty.",
        });
      }
  
      await Posts.create({
        author: req.session.user.id,
        content,
        likes: 0,
      });
  
      return res.redirect("/main");
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
}
  
// likePost(req, res)
async function likePost(req, res) {
    try {
      const postId = req.params.postId;
      await Posts.updateOne({ _id: postId }, { $inc: { likes: 1 } });
      return res.redirect("/main");
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
}
  
// deletePost(req, res)
async function deletePost(req, res) {
    try {
      const postId = req.params.postId;
  
      const post = await Posts.findById(postId).lean();
      if (!post) return res.redirect("/main");
  
      const roles = req.session.user.roles || [];
      const isAdmin = roles.includes("admin");
      const isAuthor = post.author === req.session.user.id;
  
      if (!isAdmin && !isAuthor) {
        return res.status(403).send("Forbidden");
      }
  
      await Posts.deleteOne({ _id: postId });
      return res.redirect("/main");
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
}

// GET /main - 메인 피드
router.get("/", requireLogin, getPosts);

// GET /posts/new - 새 글 작성 페이지
router.get("/posts/new", requireLogin, showNewPost);

// POST /posts - 글 작성
router.post("/posts", requireLogin, createPost);

// POST /posts/:postId/like - 좋아요 +1
router.post("/posts/:postId/like", requireLogin, likePost);

// POST /posts/:postId/delete - 삭제 (권한 체크)
router.post("/posts/:postId/delete", requireLogin, deletePost);

module.exports = router;