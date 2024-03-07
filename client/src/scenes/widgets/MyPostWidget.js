import { useTheme } from "@emotion/react";
import {
  AttachFileOutlined,
  DeleteOutline,
  EditOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import FileBase64 from "react-file-base64";

const MyPostWidget = ({ userPicture, isProfile }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picturePath", image);
      }
      const apiConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:3001/posts",
        formData,
        apiConfig
      );
      if (!isProfile) {
        dispatch(setPosts({ posts: data }));
      } else {
        const response = await axios.get(
          `http://localhost:3001/posts/${_id}/posts`,
          apiConfig
        );
        const userPosts = response.data;
        dispatch(setPosts({ posts: userPosts }));
      }
      setImage(null);
      setIsImage(false);
      setPost("");
    } catch (err) {
      console.log("CreatePost error: " + err.message);
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={userPicture} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            backgroundColor: palette.neutral.light,
            width: "100%",
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          borderRadius="5px"
          border={`1px solid ${medium}`}
          mt="1rem"
          p="1rem"
        >
          <div className="input-file">
            <FileBase64
              accept="image/*"
              multiple={false}
              type="file"
              value={image}
              onDone={({ base64 }) => {
                setImage(base64);
              }}
            />
          </div>
        </Box>
      )}
      <Divider sx={{ margin: "1.25rem 0" }} />
      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: medium,
              },
            }}
          >
            Image
          </Typography>
        </FlexBetween>
        {isNonMobileScreen ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography sx={{ color: mediumMain }}>Click</Typography>
            </FlexBetween>
            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography sx={{ color: mediumMain }}>Attachment</Typography>
            </FlexBetween>
            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography sx={{ color: mediumMain }}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <>
            <FlexBetween gap="0.25rem">
              <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
          </>
        )}
        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
