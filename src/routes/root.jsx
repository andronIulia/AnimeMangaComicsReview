import { AppBar, Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { router } from "../common/router";
import { Link } from "react-router-dom";
import { auth } from "../common/firebase";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

const drawerWidth = 240;

function Root() {
    const routes = router.routes[0].children;
    const location = useLocation();

    const [signOut] = useSignOut(auth);
    const [user] = useAuthState(auth);

    const currentRoute = routes.find(
        (route)=>route.path ? "/" + route.path === location.pathname : location.pathname === "/"
        );
    console.log(user);
    const isAdmin = user && user.uid;

    const handleLogOut = async () =>{
        const success = await signOut();

        if(success){
            alert("You have been logged out");
        }
    };

    return (
        <Box sx={{
                display: "flex"
            }}>

                <AppBar position="fixed" sx={{
                     width: `calc(100% - ${drawerWidth}px)`,
                     ml: `${drawerWidth}px`,   
                }}>
                    <Toolbar>
                        <Typography component="h1" variant="h6">
                            Books, Comics Manga Reviews
                        </Typography>
                    </Toolbar> 
                </AppBar>

                <Drawer sx={{
                    width: drawerWidth,
                    flexShrink: 0,

                    "& .MuiDrawer-paper":{
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="permanent"
                anchor="left"
                >
                    <Toolbar/>
                    <Divider/>
                    <List>
                            {routes.map((route)=>{
                               return (
                               <ListItem key={route.id} disablePadding>
                                     <ListItemButton
                                     selected={
                                        route.path
                                         ? location.pathname === "/" + route.path
                                         : location.pathname === "/"
                                     }
                                      LinkComponent={Link} to={route.path ? route.path : "/" }>
                                        <ListItemText primary={route.name}/>
                                        </ListItemButton>
                                    </ListItem>
                                    );
                                })}
                                {isAdmin && ( 
                                    <ListItem key="admin" disablePadding>
                                        <ListItemButton LinkComponent={Link} to="/admin">
                                            <ListItemText primary="Admin Panel" />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleLogOut}>
                                    <ListItemText primary="Logout"/>
                                </ListItemButton>
                            </ListItem>
                    </List>    
                </Drawer>
                <Box 
                component="main" 
                sx={{
                        flexGrow:1,
                        p:3,
                    }}>   
                            <Toolbar/>
                                <Outlet/>
                              </Box>   

            </Box>
            );
}

export default Root