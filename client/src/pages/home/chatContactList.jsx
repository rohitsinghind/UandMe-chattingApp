import React, { useState } from "react";
import { useChatContext } from "../../context/ChatContext";
import Navbar from "../../components/Navbar";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  styled,
  Badge,
  Box  ,
  Container
} from "@mui/material";

import moment from 'moment';

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function ChatContactList() {
  const { contacts, handleChatSelect } = useChatContext();
  const [display, setDisplay] = useState({
    rooms: false,
    users: true,
  });

  const contactGroups = contacts.reduce(
    (prev, curr) => {
      curr?.chatType === "room" ? prev.rooms.push(curr) : prev.users.push(curr);
      return prev;
    },
    {
      // rooms: [],
      users: [],
    }
  );

  const handleToggleDisplay = (key) => {
    setDisplay((prev) => ({ ...prev, [key]: !display[key] }));
  };

  const renderedGroups = Object.entries(contactGroups).map(([key, values]) => {
    const renderedContacts = values.map((contact) => {
      const {
        _id,
        avatarImage,
        name,
        latestMessage,
        isOnline,
        latestMessageUpdatedAt,
        unreadCount,
        ...otherContact
      } = contact;
      return (
        <>
          <ListItem
            key={_id}
            sx={{ background: "#14241e", mb: 1,px:1, borderRadius: "50px", height:"55px"}}
            onClick={(e) => handleChatSelect(contact)}
            secondaryAction={
              <Box sx={{display:"flex", flexDirection:"column"}}>
              {
                latestMessageUpdatedAt?<Typography sx={{fontSize:"12px",mb:0.5}}>{moment(latestMessageUpdatedAt).fromNow()}</Typography>:""
              }
                {unreadCount>0?
                  <Badge sx={{alignSelf:"flex-end",m:1, fontSize:"12px"}} badgeContent={unreadCount} max={99} color="success"/>:""}
              </Box>
            }
            disablePadding
          >
            <ListItemAvatar>
              {isOnline ? (
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    alt=""
                    src={avatarImage}
                  />
                </StyledBadge>
              ) : (
                <Avatar
                  alt=""
                  src={avatarImage}
                />
              )}
            </ListItemAvatar>
            <ListItemText primary={name} secondary={latestMessage} />
          </ListItem>
        </>
      );
    });

    return (
      <div key={key}>
       <Typography sx={{fontSize:"18px", fontWeight:"600", textAlign:"center",mb:"10px"}}>Chats</Typography>
        {display[key] ? renderedContacts : null}
      </div>
    );
  });

  return (
    <>
     <Navbar/>
     <Container maxWidth="sm" disableGutters>
      <List sx={{ width: "100%", bgcolor: "background.paper",px:1,  height:"calc(100vh - 65px)",overflow:"scroll",overflowX:"hidden", }}>
        {renderedGroups}
      </List>
      </Container>
    </>
  );
}
