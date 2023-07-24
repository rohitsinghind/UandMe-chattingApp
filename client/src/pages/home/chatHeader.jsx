import { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Box, AppBar, Toolbar, IconButton, Typography, Stack, Avatar, Chip} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhoneIcon from '@mui/icons-material/Phone';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import ImageDialogBox from '../../components/ImageDialogBox';

export default function ChatHeader() {

    const [img, setImg] = useState("")
    const { chatInfo, setChatInfo, contacts, handleChatSelect } = useChatContext();

  return (
    <>
    <ImageDialogBox img={img} setImg={setImg}/>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
            onClick={(e) => handleChatSelect("")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Avatar
                    alt=""
                    src={chatInfo?.avatarImage}
                    sx={{mr:2}}
                    onClick={()=>setImg(chatInfo?.avatarImage)}
            />
            <Stack sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{lineHeight:"25px"}}>{chatInfo?.name}</Typography>
                {
                    chatInfo?.isOnline?<Typography sx={{fontSize:"12px", color:"#62c162", ml:0.5}}>• Online</Typography>:""
                }
            </Stack>
          <Stack direction="row" spacing={0.25}>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
            >
                <VideocamIcon />
            </IconButton>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
            >
                <PhoneIcon />
            </IconButton>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
            >
                <MoreVertIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
    </>
  )
}
