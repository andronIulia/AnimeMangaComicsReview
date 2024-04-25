// AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { auth, firestore } from "../common/firebase";
import { doc, getDoc } from "firebase/firestore";
import { AppBar, Box, Button, Container, Divider, Drawer, InputAdornment, List, ListItem, ListItemButton,ListItemText, TextField, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signOut] = useSignOut(auth);
    //const [user] = useAuthState(auth);

  //const userId = user.uid;
  const handleLogOut = async () =>{
    const success = await signOut();

    if(success){
        alert("You have been logged out");
    }
};

  useEffect(() => {
    
    const checkAdminStatus = async (userId) => {
      try {
        if (!user || !user.uid) {
          console.error("Invalid user or user ID");
          return;
        }
        const userId = user.uid;
        const userDocRef = doc(firestore, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
    
        if (!userDocSnap.exists()) {
          console.error("User document not found");
          return;
        }
    
        const userData = userDocSnap.data();
    
        if (!userData || userData.isAdmin === undefined) {
          console.error("User data or isAdmin property is undefined");
          return;
        }
    
        const userIsAdmin = userData.isAdmin === true;
        setIsAdmin(userIsAdmin);
    
        if (!userIsAdmin) {
          navigate("/");
          return;
        }
    
        if (userData.path && typeof userData.path === 'string') {
          const indexOfValue = userData.path.indexOf("someValue"); 
          console.log("Index of value:", indexOfValue);
        } else {
          console.error("User data, path property, or path is not a string");
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    

    checkAdminStatus();
  }, [user, navigate]);

  const routes = [
    { id: 5, path: "books", name: "Admin Books" },
    { id: 6, path: "comics", name: "Admin Comics" },
    { id: 7, path: "manga", name: "Admin Manga" },
    { id: 8, path: "contact", name: "Admin Contact" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography component="h1" variant="h6">
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {routes.map((route) => (
            <ListItem key={route.id} disablePadding>
              <ListItemButton LinkComponent={Link} to={`/admin/${route.path}`}>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogOut}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminPanel;
