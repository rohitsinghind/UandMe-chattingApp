import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { chatAPI } from '../../api';
import { useChatContext } from '../../context/ChatContext';
import { useAuthContext } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';
import { useAxios } from '../../hooks/useAxios';
import { socketEmitEvent } from '../../socket/emit';

import { TextField, IconButton, Stack ,Skeleton, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function MessageInput({ setChatMessages }) {

    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
  
    const { user } = useAuthContext();
    const { chatId, chatInfo, updateContactLatestMessage } = useChatContext();
    const {
      socketValue: { socket, typingNotify }
    } = useSocketContext();
    const { sendRequest: postUserMessage } = useAxios();
  
    const handleInputSubmit = (e) => {
      e.preventDefault();
      if (inputMessage.trim() === '') {
        setInputMessage('');
        return;
      }
      postUserMessage(
        {
          method: 'POST',
          url: chatAPI.postUserMessage({
            userId: user._id,
            chatId,
            type: chatInfo.chatType
          }),
          data: {
            message: inputMessage.trim()
          }
        },
        (data) => {
          // room message
          setChatMessages((prev) => [...prev, { ...data.data, avatarImage: user.avatarImage }]);
  
          // socket
          socketEmitEvent(socket).sendMessage({
            ...data.data,
            avatarImage: user.avatarImage,
            type: chatInfo.chatType,
            receiver: chatId
          });
  
          // contact list
          updateContactLatestMessage({
            ...data.data,
            type: chatInfo.chatType,
            updateId: chatId,
            unreadCount: 0
          });
  
          setInputMessage('');
        }
      );
    };
  
    const handleKeyUp = () => {
      const newTypingStatus = inputMessage.trim() !== '';
      if (isTyping !== newTypingStatus) {
        socketEmitEvent(socket).userTyping({
          chatType: chatInfo.chatType,
          senderId: user._id,
          receiverId: chatId,
          typing: newTypingStatus,
          // message: `${user.name} is typing...`
          message: `typing...`
        });
      }
      setIsTyping(newTypingStatus);
    };

    document.onkeydown = checkKey;
    function checkKey(e) {
      e = e || window.event;
      if (e.keyCode === 13) {
        handleInputSubmit(e);
      }
    }
  
    useEffect(() => {
      if (typingNotify) {
        const { chatType, senderId, receiverId, typing } = typingNotify;
        const isChatting = chatType === 'user' ? chatId === senderId : chatId === receiverId;
        setShowNotify(typing && isChatting);
      } else {
        setShowNotify(false);
      }
    }, [typingNotify, chatId]);
  

  return (
    <Box sx={{position:"absolute", width:"100%", bottom:"5px"}}>
      {showNotify && (
        <>
            <Skeleton variant="rounded" sx={{ fontSize: '14px', px:"20px", display:"flex", alignItems:"center", fontFamily:"sans-serif", fontStyle:"italic",borderRadius:"20px", position:"absolute", bottom:"65px", left:0, right:0, marginLeft:"auto", marginRight:"auto"}} height={25}>{typingNotify.message}</Skeleton>
        </>
      )}
      {chatId ? (
        <>
        <Stack direction="row" spacing={0} sx={{flexGrow:1}}>
          <TextField 
              type="text"
             name="inputMessage"
             placeholder="Type something ..."
             value={inputMessage}
             onChange={(e) => setInputMessage(e.target.value)}
             onKeyUp={handleKeyUp}
             fullWidth
            variant="filled" 
            />
            <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{background:"#3b7a57", height:"50px", width:"50px", mx:1, my:0.5}}
            onClick={handleInputSubmit}
          >
            <SendIcon />
          </IconButton>
        </Stack>
        </>
      ) : null}
    </Box>
  )
}

MessageInput.propTypes = {
    setChatMessages: PropTypes.func
  };
  