import { useTheme } from "@emotion/react";
import {
  ChatBubbleOutline,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import axios from "axios";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [isComments, setIsComments] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const isLiked = Boolean(likes?.[loggedInUserId]);
  const likeCount = likes ? Object.keys(likes).length : 0;
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const apiConfig = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const patchLike = async () => {
    try {
      const sendData = {
        userId: loggedInUserId,
      };
      const { data } = await axios.patch(
        `http://localhost:3001/posts/${postId}/like`,
        sendData,
        apiConfig
      );
      dispatch(setPost({ post: data }));

      console.log();
    } catch (err) {
      console.log("PatchLike error: " + err.message);
    }
  };
  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picturePath}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          {/* LIKE AREA */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          {/* COMMENTS AREA */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutline />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && comments.length > 0 && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
