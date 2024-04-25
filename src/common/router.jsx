import { createBrowserRouter } from "react-router-dom";
import Root from "../routes/root";
import BooksPage from "../routes/books";
import ComicsPage from "../routes/comics";
import MangaPage from "../routes/manga";
import Contact from "../routes/contact";
import React from "react"
import Register from "../routes/register";
import Login from "../routes/login";
import RequireAuth from "../components/shared/require-auth";
import AdminPanel from "../routes/AdminPanel";
import AdminBooksPage from "../routes/adminBooks";
import AdminComicsPage from "../routes/admincomics";
import AdminMangaPage from "../routes/adminManga";
import BookDetailsPage from "../components/DetailsBookPage";
import MangaDetailsPage from "../components/DetailsMangaPage";
import ComicDetailsPage from "../components/DetailsComicPage";

export const router = createBrowserRouter([
    {
    path: "/",
    element:(
    <RequireAuth>
      <Root/>
    </RequireAuth>
    )
    ,
    name:"Home",
    children:[
      {
        id:1,
        path: "books/",
        element: <BooksPage />,
        name:'Books'
      },
      {
        id:2,
        path: "comics/",
        element: <ComicsPage/>,
        name:'Comics'
      },
      {
        id:3,
        path: 'manga/',
        element: <MangaPage/>,
        name:'Manga'
      },
      {
        id:4,
        path: "contact/",
        element: <Contact/>,
        name:'Contact'
      }
    ]
    },
    {
      path: "/books/:bookId",
      element: <BookDetailsPage />,
      name: 'BookDetails'
  },
  {
    path: "/comics/:comicId",
    element: <ComicDetailsPage />,
    name: 'ComicDetails'
},
{
  path: "/manga/:mangaId",
  element: <MangaDetailsPage />,
  name: 'MangaDetails'
},
    {
      path:"/register",
      element:<Register/>,
      name:"register"
    },
    {
      path:"/login",
      element:<Login/>,
      name:"login"
    },
    {
      path: "/admin",
      element: (
        <RequireAuth>
          <AdminPanel />
        </RequireAuth>
      ),
      name: "AdminPanel",
      children:[
        {
          id:5,
          path: "books/",
          element: <AdminBooksPage />,
          name:'AdminBooks'
        },
        {
          id:6,
          path: "comics/",
          element: <AdminComicsPage/>,
          name:'AdminComics'
        },
        {
          id:7,
          path: 'manga/',
          element: <AdminMangaPage/>,
          name:'AdminManga'
        },
        {
          id:8,
          path: "contact/",
          element: <Contact/>,
          name:'Contact'
        }
      ]
    }

  ])

