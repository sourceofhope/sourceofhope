import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx"
import HomePage from "./pages/home/HomePage.jsx";
import ErrorBoundary from "./pages/ErrorBoundary.jsx";
import AboutPage from "./pages/about/AboutPage.jsx";

import "./style.css";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Navigate to="/sourceofhope/" replace /> },
      { path: "/sourceofhope", element: <Navigate to="/sourceofhope/" replace /> },
      { path: "/sourceofhope/", element: <HomePage /> },
      { path: "/sourceofhope/about", element: <AboutPage /> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
