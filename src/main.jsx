import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx"
import HomePage from "./pages/home/HomePage.jsx";
import ErrorBoundary from "./pages/ErrorBoundary.jsx";

import "./style.css";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/sourceofhope", element: <HomePage /> },
    ],
  },
  { basename: import.meta.env.BASE_URL },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
