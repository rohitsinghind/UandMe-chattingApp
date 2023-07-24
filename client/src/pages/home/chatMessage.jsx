import PropTypes from 'prop-types';
import { forwardRef, useRef, useImperativeHandle } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useChatContext } from '../../context/ChatContext';

import { Paper, Typography,  } from '@mui/material';

import moment from 'moment';

const ChatMessage = forwardRef(function ChatMessage({ sender, avatarImage, _id, message, updatedAt, readers }, ref) {
    const { user } = useAuthContext();
    const { chatInfo } = useChatContext();
    const messageRef = useRef(null);

    console.log(updatedAt)
  
    useImperativeHandle(
      ref,
      () => {
        return {
          scrollIntoView() {
            messageRef.current.scrollIntoView({
              behavior: 'smooth'
            });
          }
        };
      },
      []
    );
  
    const fromSelf = user._id === sender;
    const isRoom = chatInfo.chatType === 'room';
  
    return (
    <>
    {
      fromSelf?
      <Paper sx={{borderRadius:"20px", m:1, px:2, py:0.5, maxWidth:"80%", alignSelf:"flex-end"}} ref={messageRef}>
      <Typography sx={{color:"#cfcfcf", fontSize:"14px"}}>{message}</Typography>
      {
        updatedAt?<Typography sx={{color:"#9d9d9d", fontSize:"12px"}} textAlign={"end"}>{moment(updatedAt).calendar()}</Typography>:""
      }
    </Paper>
    :
    <Paper sx={{borderRadius:"20px", m:1, px:2, py:0.5, maxWidth:"80%", alignSelf:"flex-start"}} ref={messageRef}>
      <Typography sx={{color:"#cfcfcf", fontSize:"14px"}}>{message}</Typography>
      {
        updatedAt?<Typography sx={{color:"#9d9d9d", fontSize:"12px"}} textAlign={"end"}>{moment(updatedAt).calendar()}</Typography>:""
      }
    </Paper>
    }
    </>
    );
  });
  
  ChatMessage.propTypes = {
    sender: PropTypes.string.isRequired,
    avatarImage: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    readers: PropTypes.array.isRequired
  };
  
  export default ChatMessage;
