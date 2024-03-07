import React, { useEffect, useState } from "react";
import PostWidget from "./PostWidget";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "state";

const PostsWidget = ({ userId, isProfile = false }) => {
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const apiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const getPosts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3001/posts",
        apiConfig
      );
      dispatch(setPosts({ posts: data }));
      console.log("posts", data);
    } catch (err) {
      console.log("GetFeedPosts error: " + err.message);
    }
  };
  const getUserPosts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/posts/${userId}/posts`,
        apiConfig
      );
      dispatch(setPosts({ posts: data }));
    } catch (err) {
      console.log("GetFeedPosts error: " + err.message);
    }
  };
  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []);
  return (
    <>
      {posts.map(
        ({ _id, userId, description, picturePath, likes, comments }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId._id}
            name={`${userId?.firstName} ${userId?.lastName}`}
            description={description}
            location={userId?.location}
            picturePath={picturePath}
            userPicturePath={userId?.picturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
