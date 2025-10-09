import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { ROUTES, CANONICAL } from "./routes.jsx";

import AppLayout from "./components/layout/AppLayout.jsx";
import ErrorBoundary from "./pages/ErrorBoundary.jsx";

const HomePage = lazy(() => import("./pages/home/HomePage.jsx"));
const AboutPage = lazy(() => import("./pages/about/AboutPage.jsx"));
const ServePage = lazy(() => import("./pages/serve/ServePage.jsx"));

import "./style.css";

const PageMap = {
  home: <HomePage />,
  about: <AboutPage />,
  serve: <ServePage />,
};

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Navigate to={CANONICAL.home} replace /> },
      ...Object.entries(ROUTES).flatMap(([key, paths]) =>
        paths.map((path) => ({
          path,
          element: PageMap[key],
        }))
      ),
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
