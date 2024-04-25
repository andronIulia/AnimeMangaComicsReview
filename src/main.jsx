import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.tsx'
import { CssBaseline,ThemeProvider} from '@mui/material'
import { theme } from './common/theme.js'
import { RouterProvider} from 'react-router-dom'
import { router } from './common/router.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router}/>
    </ThemeProvider>
  </React.StrictMode>
);