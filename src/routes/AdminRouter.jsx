
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminBooksPage from "./AdminBooksPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/books" element={<AdminBooksPage action="add" />} />
        <Route
          path="/admin/books/:bookId/edit"
          element={<AdminBooksPage action="edit" />}
        />
        <Route
          path="/admin/books/:bookId/delete"
          element={<AdminBooksPage action="delete" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
