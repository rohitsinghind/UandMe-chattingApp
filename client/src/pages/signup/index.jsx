import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAxios } from '../../hooks/useAxios';
import { authAPI } from '../../api';
import { useAuthContext } from '../../context/AuthContext';
import {Container, Paper, Typography, FormControl, TextField,OutlinedInput,InputAdornment,IconButton, InputLabel, Button, Avatar } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ImageDialogBox from '../../components/ImageDialogBox';

export default function SignUp() {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        avatarImage:'',
      });
      const [img, setImg] = useState("")
      const [showPassword, setShowPassword] = useState(false)
      const { setUser, setToken } = useAuthContext();
    
      const { error: submitError, isLoading: submitLoading, sendRequest: postRegister } = useAxios();
    
      useEffect(() => {
        if (submitError?.errors) {
          submitError.errors.forEach((e) => {
            alert(e.msg);
          });
        } else if (submitError?.message) {
          alert(submitError.message);
        }
      }, [submitError]);
    
      const submitValidator = () => {
        const { username, email, password, avatarImage } = formData;
    
        const checkArray = [username, email, password, avatarImage];
        if (checkArray.some((el) => el === '')) {
          alert('All fields are required!');
          return false;
        }
        return true;
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = submitValidator();
        if (isValid) {
          postRegister(
            {
              method: 'POST',
              url: authAPI.register,
              data: { ...formData }
            },
            (data) => {
              const { accessToken, ...other } = data.data;
              setUser({ ...other });
              setToken({ accessToken });
            }
          );
        }
      };
    
      const handleChange = (e) => {
        setFormData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value
        }));
      };
    
      const handleImageChange = (e) => {
        const file = e.target.files[0];
    
        const Reader = new FileReader();
        Reader.readAsDataURL(file);
    
        Reader.onload = () => {
          if (Reader.readyState === 2) {
            setFormData({...formData,["avatarImage"]:Reader.result});
          }
        };
      };

  return (
    <>
    <ImageDialogBox img={img} setImg={setImg}/>
    <Navbar/>
    <Container maxWidth="xs" sx={{py:"30px"}} >
      <Paper elevation={3} sx={{p:4, display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", borderRadius:"10px"}}>
        <Typography sx={{fontSize:"22px", fontWeight:"600", mb:1}}>Create an Account</Typography>
        <div style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"270px",
        marginBottom:"15px"
          }}>
            <Avatar
          src={formData.avatarImage}
          alt="User"
          sx={{ height: "70px", width: "70px",mr:"20px" }}
          onClick={()=>formData.avatarImage?setImg(formData.avatarImage):""}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
          <TextField
            id="username"
          type="text"
          name="username"
            label="Enter your Username"
            placeholder="Username"
            fullWidth
            sx={{my:1}}
            value={formData.username || ''}
            onChange={handleChange}
          />
          <TextField
            id="email"
          type="text"
          name="email"
            label="Enter your Email"
            placeholder="Email"
            fullWidth
            sx={{my:1}}
            value={formData.email || ''}
            onChange={handleChange}
          />
          <FormControl fullWidth sx={{my:1}}>
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
                  onClick={()=>setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          </FormControl>
          <Button variant='contained' fullWidth sx={{my:2}} disabled={submitLoading} onClick={handleSubmit} color='success'>Sign Up</Button>
          <Typography sx={{display:"flex", gap:"10px"}}> Hhave an account? <Link to="/login" style={{textDecoration:'none'}}><Typography  sx={{color:"#0095f6", fontWeight:"600", cursor:"pointer",'&:hover':{color:"#2cacff",}}} >Login</Typography></Link></Typography>
      </Paper>
    </Container>
    <Footer/>
    </>
  )
}
