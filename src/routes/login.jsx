import { Box, Button, Container, InputAdornment, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { auth,firestore} from "../common/firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { checkIfUserIsAdmin } from "../common/checkadmin";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
    const navigate = useNavigate();
    
    const [signInWithEmailandPassword,user]=
        useSignInWithEmailAndPassword(auth);

    const [signInWithGoogle,gUser] = 
        useSignInWithGoogle(auth);

        
    const handleSubmit = async (e)=> {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const userCredential = await signInWithEmailandPassword(email, password);
            const user = userCredential.user;
            console.log('User:', user);
            if (user && user.uid) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log('User ID:', user.uid);
                const isAdmin = await checkIfUserIsAdmin(user.uid);
    
                if (isAdmin) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                console.error('User is not authenticated.');
            }
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    useEffect(()=>{
        const handleLogin = async () => {
        if(user || gUser) {
                try {
                    const isAdmin = await checkIfUserIsAdmin( user?.uid || gUser?.uid);
                if (isAdmin) {
                navigate("/admin");
            } else {
                navigate("/");
                }
            }
            catch(error) {
                console.error('Error checking admin status:', error);
                navigate("/error");
            }//);
        }
    };
        handleLogin();
    }, [user,gUser, navigate]);
    return( 
        <Container maxWidth="xs">
        <Box
            sx={{
                marginTop:8,
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
            }}
        >
            <Typography component="h1" variant="h5">
                Login
            </Typography>

            <Box component='form' noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                <TextField
                    margin="normal"
                    fullWidth
                    name="email"
                    label="Email Address"
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt:3, mb: 2 }}
            >
                Login
            </Button>
            <Button
                type="submit"
                fullWidth 
                variant="outlined"
                sx={{ mt:3, mb: 2 }}
                onClick={() => signInWithGoogle()}
            >
                Login with Google
            </Button>

            <Button
                type="submit"
                fullWidth 
                variant="outlined"
                sx={{ mt:3, mb: 2 }}
                component={Link}
                to="/register"
            >
                Don't have an account? Register here.
            </Button>

            </Box>

        </Box>
    </Container>
    )
}

export default Login;