import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAxios } from '../../hooks/useAxios';
import { authAPI } from '../../api';
import { useAuthContext } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';
import {Container, Paper, Typography, FormControl, TextField,OutlinedInput,InputAdornment,IconButton, InputLabel, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Login() {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
      });
      const [showPassword, setShowPassword] = useState(false)
    
      const { setUser, setToken } = useAuthContext();
      const { socketConnect } = useSocketContext();
      const { error, isLoading, sendRequest: postLogin } = useAxios();

      const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
      };

      const handleChange = (key) => {
        key.preventDefault();
        setFormData({ ...formData, [key.target.id]: key.target.value });
      };
    
      useEffect(() => {
        if (error?.errors) {
          error.errors.forEach((e) => {
            alert(e.msg);
          });
        } else if (error?.message) {
          alert(error.message);
        }
      }, [error]);
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
          alert('All fields are required!');
          return;
        }
        postLogin(
          {
            method: 'POST',
            url: authAPI.login,
            data: { ...formData }
          },
          (data) => {
            const { accessToken, ...other } = data.data;
            setUser({ ...other });
            setToken({ accessToken });
            socketConnect();
          }
        );
      };

  return (
    <>
     <Navbar/>
    <Container maxWidth="xs" sx={{py:"100px"}}>
      <Paper elevation={3} sx={{p:4, display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", borderRadius:"10px"}}>
        <Typography sx={{fontSize:"22px", fontWeight:"600"}}>Login</Typography>
          <TextField
            id="username"
          type="text"
          name="username"
            label="Enter your Username"
            placeholder="Username"
            fullWidth
            sx={{my:2}}
            value={formData.username || ''}
            onChange={handleChange}
          />
          <FormControl fullWidth>
           <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password || ''}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          </FormControl>
          <Button variant='contained' fullWidth sx={{my:2}} disabled={isLoading} onClick={handleSubmit} color='success'>Login</Button>
          <Typography sx={{display:"flex", gap:"10px"}}> Don't have an account? <Link to="/signup" style={{textDecoration:'none'}}><Typography  sx={{color:"#0095f6", fontWeight:"600", cursor:"pointer",'&:hover':{color:"#2cacff",}}} >Sign up </Typography></Link></Typography>
      </Paper>
    </Container>
    <Footer/>
    </>
  )
}
