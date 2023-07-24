import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";
import { useSocketContext } from "../context/SocketContext";
import { socketEmitEvent } from "../socket/emit";
import { AppBar, Container, Toolbar, Typography, IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
  const { user, setUser, setToken } = useAuthContext();
  const { setChatInfo } = useChatContext();

  const {
    socketValue: { socket, socketId, onlineUsers },
    resetSocketValue,
  } = useSocketContext();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (socketId) {
      setShow(true); // TODO:
    }
  }, [socketId]);

  const handleLogout = () => {
    console.log("logout", socketEmitEvent(socket));
    setUser(null);
    setToken(null);
    setChatInfo(null);
    if (socketId) {
      socketEmitEvent(socket).userOffline(user._id);
      console.log("DISCONNECT");
      resetSocketValue();
      socket.disconnect();
    }
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              sx={{
                fontFamily:"cursive",
                fontWeight: 700,
                letterSpacing: ".3rem",
                textDecoration: "none",
                flexGrow: 1,
              }}
            >
              U&Me
            </Typography>
            {user ? (
              <IconButton aria-label="logout" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            ) : (
              ""
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
