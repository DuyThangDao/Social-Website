import Post from "../models/postModel.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    console.log(req.body);
    const newPost = await Post.create({
      userId: userId,
      description: description,
      picturePath: picturePath,
      like: {},
      comments: [],
    });
    const posts = await Post.find().populate(
      "userId",
      "firstName lastName location picturePath"
    );
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "firstName lastName location picturePath"
    );
    console.log(posts);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).populate(
      "userId",
      "firstName lastName location picturePath"
    );
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id).populate(
      "userId",
      "firstName lastName location picturePath"
    );
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    ).populate("userId", "-password");
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
