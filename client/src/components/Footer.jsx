import React from 'react'
import { AppBar, Container, Toolbar, Typography, IconButton } from "@mui/material";

export default function Footer() {
  return (
    <>
            <Typography
              sx={{
                textAlign:"center",
                background:"#19332a",
                p:1,
                fontSize:"12px"
              }}
            >
              © 2023, U&Me
            </Typography>
    </>
  )
}
