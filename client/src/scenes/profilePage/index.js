import { Box, useMediaQuery } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";

const ProfilePage = () => {
  const { _id } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
  const apiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const getUser = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/user/${userId}`,
        apiConfig
      );
      setUser(data);
    } catch (err) {
      console.log("ProfilePage error: " + err.message);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  if (!user) return null;
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreen ? "flex" : "block"}
        gap="4rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreen ? "30%" : undefined} m="2rem 0">
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          {isNonMobileScreen && <FriendListWidget />}
        </Box>
        <Box flexBasis={isNonMobileScreen ? "42%" : undefined}>
          {userId === _id && (
            <MyPostWidget userPicture={user.picturePath} isProfile={true} />
          )}
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
