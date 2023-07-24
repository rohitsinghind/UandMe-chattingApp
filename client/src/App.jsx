import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatContextProvider from './context/ChatContext';
import { useSocketContext } from './context/SocketContext';
import { useAuthContext } from './context/AuthContext';
import { socketEmitEvent } from './socket/emit';
import { useLocalStorage } from './hooks/useLocalStorage';import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


import Navbar from './components/Navbar';
import Login from './pages/login';
import Home from './pages/home';
import SignUp from './pages/signup';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
          // divider: deepOrange[700],
          background: {
            default: "#14241e",
            paper: "#12281b",
          },
          text: {
            primary: '#dcdcdc',
            secondary: "#dcbcb3",
          },
  },
});

function App() {

  const { user } = useAuthContext();
  const [mode, setMode] = useLocalStorage('chat-app-mode', 'light');

  const {
    socketConnect,
    socketValue: { socket, socketId }
  } = useSocketContext();

  useEffect(() => {
    if (user && !socketId) {
      socketConnect();
    }
  }, [user, socketId, socketConnect]);

  useEffect(() => {
    if (user && socketId) {
      socketEmitEvent(socket).userOnline(user._id, socketId);
    }
  }, [socketId, socket, user]);


  return (
    <>
      <ChatContextProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace={true} />} />
          {/* <Route path="/open-room" element={user ? <Room /> : <Navigate to="/login" replace={true} />} /> */}
          <Route path="/login" element={user ? <Navigate to="/" replace={true} /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace={true} /> : <SignUp />} />
        </Routes>
      </ThemeProvider>
      </ChatContextProvider>
    </>
  )
}

export default App
