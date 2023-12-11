const express = require("express");
const { PostsModel } = require("../models/posts.model");
const { auth } = require("../middlewares/authmiddleware");
const postsRouter = express.Router();

postsRouter.use(auth);

postsRouter.get("/", async (req, res) => {
    const { device1, device2 } = req.query;
    const { userId } = req.body;

    const query = {};

    if (userId) {
        query.userId = userId
    }
    if (device1) {
        query.device = device1
    }
    else if (device1 && device2) {
        query.device = { $and: [{ device: device1 }, { device: device2 }] };
    }

    try {
        const post = await PostsModel.find(query);
        res.status(200).send(post)
    } catch (error) {
        res.status(400).send({ error: error.message });

    }
});


postsRouter.post("/add", async (req, res) => {
    const { userId } = req.body;
    try {
        const post = new PostsModel({...req.body,userId});
        await post.save();
        res.status(200).send({ msg: "New posts are added"});
    } catch (error) {
        res.status(400).send({ error: error.message });

    }
});

postsRouter.patch("/update/:postId", async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await PostsModel.findByIdAndUpdate({ userId, _id: postId }, req.body);
        if (!post) {
            res.status(400).send({ msg: "post not found" });
        }
        else {
            res.status(200).send({ msg: `post updated` });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

postsRouter.delete("/delete/:postId", async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {

        const post = await PostsModel.findByIdAndDelete({ userId, _id: postId });
        if (!post) {
            res.status(400).send({ msg: "post not found" });
        }
        else {
            res.status(200).send({ msg: `post deleted` });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });

    }
});

module.exports = { postsRouter }