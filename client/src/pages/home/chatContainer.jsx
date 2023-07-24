import React, { useState, useEffect, useCallback } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { useAuthContext } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';
import { chatAPI } from '../../api';
import { useAxios } from '../../hooks/useAxios';
import ChatHeader from './chatHeader';
import MessageContainer from './messageContainer';
import MessageInput from './messageInput';
import { Container } from '@mui/material';

export default function ChatContainer() {

  const { user } = useAuthContext();
  const { chatId, chatInfo, updateMessageStatusToRead } = useChatContext();
  const { isLoading: messageLoading, sendRequest: getUserMessages } = useAxios();
  const {
    socketValue: { messageData, messageReadStatus },
    resetSocketValue
  } = useSocketContext();

  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    if (chatId) {
      getUserMessages(
        {
          method: 'GET',
          url: chatAPI.getUserMessages({
            userId: user._id,
            chatId,
            type: chatInfo.chatType
          })
        },
        (data) => {
          setChatMessages(data.data);
        }
      );
    }
  }, [chatId, getUserMessages, user._id, chatInfo]);

  const checkIsChatting = useCallback(
    (messageData) => {
      const { type, sender, receiver } = messageData;
      return type === 'user' ? chatId === sender : chatId === receiver;
    },
    [chatId]
  );

  const updateSelfMessageStatus = useCallback(
    (messageData) => {
      setChatMessages((prev) => [
        ...prev,
        {
          ...messageData,
          readers: [user._id]
        }
      ]);
    },
    [user]
  );

  useEffect(() => {
    if (messageData) {
      console.log('=== socket ===', messageData);
      const isChatting = checkIsChatting(messageData);
      if (isChatting) {
        updateSelfMessageStatus(messageData);
        const { receiver, sender, type } = messageData;
        const toId = type === 'room' ? receiver : sender;
        updateMessageStatusToRead(toId, type);
      }
      // RESET
      resetSocketValue('messageData');
    }
  }, [messageData, checkIsChatting, updateSelfMessageStatus, updateMessageStatusToRead, resetSocketValue]);

  // socket message update status
  useEffect(() => {
    if (messageReadStatus) {
      const { type, readerId, toId: receiveRoomId } = messageReadStatus;
      const isChatting = type === 'user' ? chatId === readerId : chatId === receiveRoomId;
      if (isChatting) {
        console.log('*** set chat message read status ***', messageReadStatus);
        setChatMessages((prev) =>
          prev.map((msg) => (msg.sender !== readerId ? { ...msg, readers: [...msg.readers, readerId] } : msg))
        );
      }
    }
  }, [messageReadStatus, chatId])

  return (
    <>
    <Container maxWidth="sm" disableGutters>
    <ChatHeader/>
    <MessageContainer chatMessages={chatMessages} messageLoading={messageLoading}/>
    <MessageInput setChatMessages={setChatMessages}/>
    </Container>
    </>

  )
}
