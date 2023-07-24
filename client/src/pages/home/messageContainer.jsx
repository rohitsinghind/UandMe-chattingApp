import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useChatContext } from '../../context/ChatContext';
import ChatMessage from './chatMessage';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function MessageContainer({ chatMessages, messageLoading }) {
    const { chatId } = useChatContext();

    const msgRef = useRef(null);
  
    useEffect(() => {
      if (msgRef.current) {
        msgRef.current.scrollIntoView();
      }
    }, [chatMessages]);
  
    const renderedMessage = chatMessages.map((msg) => {
      return <ChatMessage key={msg._id} {...msg} ref={msgRef} />;
    });
  
    return (
      <>
      <Box sx={{width: "100%", bgcolor: "background.paper", px:1, height:"calc(100vh - 125px)", overflow:"scroll", overflowX:"hidden", display:"flex", flexDirection:"column"}}>
        {messageLoading ? (
          <Box sx={{display:"flex", height:"calc(100vh - 125px)", justifyContent:"center", alignItems:"center"}}><CircularProgress color="success" /></Box>
          ) : chatMessages.length === 0  ? (
            <Box sx={{display:"flex", height:"calc(100vh - 125px)", justifyContent:"center", alignItems:"center"}}><Typography sx={{fontSize:"16px",color:"#9d9d9d"}}>Type to start chatting</Typography></Box>
          ) : (
            renderedMessage
          )}
      </Box>
      </>
      // <div>
      //   {chatId ? (
      //     messageLoading ? (
      //       <div>Loading...</div>
      //     ) : chatMessages.length === 0 ? (
      //       <div>Type to start chatting 🚀</div>
      //     ) : (
      //       renderedMessage
      //     )
      //   ) : (
      //     <div>Select a user to start a chat</div>
      //   )}
      // </div>
    );
}

MessageContainer.propTypes = {
    chatMessages: PropTypes.array,
    messageLoading: PropTypes.bool
  };