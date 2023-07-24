import React from 'react'
import {Dialog, AppBar, Toolbar, IconButton, Typography, Box} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function ImageDialogBox({img, setImg}) {
  return (
    <>
      <Dialog
        open={img}
        onClose={()=>{setImg("")}}
        maxWidth="xs"
        sx={{backdropFilter:"blur(6px)"}}
      >
            <IconButton
              edge="start"
              onClick={()=>setImg("")}
              aria-label="close"
              sx={{position:"absolute", top:"5px", left:"20px", color:"gray"}}
            >
              <CloseIcon />
            </IconButton>
        <Box sx={{background:"black", height:"300px",width:"280px", display:"flex", justifyContent:"center", alignItems:"center",}}>
            <img style={{maxWidth:"100%",maxHeight:"100%"}} src={img} alt="" />
        </Box>
      </Dialog>
    </>
  )
}
