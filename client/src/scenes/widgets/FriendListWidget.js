import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import axios from "axios";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = () => {
  const userId = useSelector((state) => state.user._id);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const { friends } = useSelector((state) => state.user);
  const apiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const getFriends = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/user/${userId}/friends`,
        apiConfig
      );
      dispatch(setFriends({ friends: data }));
    } catch (err) {
      console.log("getFriendsList error: " + err.message);
    }
  };
  useEffect(() => {
    getFriends();
  }, []);
  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        mb="1.5rem"
      >
        My Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
