import { useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { useSocketContext } from '../../context/SocketContext';
import { Container } from '@mui/material';

import ChatContactList from './chatContactList';
import ChatContainer from './chatContainer';

export default function Home() {
    const { chatId, chatInfo } = useChatContext();
    const { contacts, handleChatSelect } = useChatContext();

    const {
      socketValue: { roomNotify, invitedNotify },
      resetSocketValue
    } = useSocketContext();
  
    useEffect(() => {
      if (invitedNotify) {
        // defaultToast(invitedNotify);
      }
      return () => {
        resetSocketValue('invitedNotify');
      };
    }, [invitedNotify, resetSocketValue]);
  
    useEffect(() => {
      if (roomNotify && chatInfo?.chatType === 'room') {
        // defaultToast(roomNotify);
      }
      return () => {
        resetSocketValue('roomNotify');
      };
    }, [roomNotify, chatInfo, resetSocketValue]);

  return (
    <>
      {
        chatInfo?<ChatContainer/>:<ChatContactList/>
      }
    </>
  )
}
