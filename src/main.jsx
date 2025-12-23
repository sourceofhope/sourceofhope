import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout.jsx";
import ErrorBoundary from "./pages/ErrorBoundary.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import AboutPage from "./pages/about/AboutPage.jsx";
import ServePage from "./pages/serve/ServePage.jsx";
import ConnectPage from "./pages/connect/ConnectPage.jsx";
import MediaPage from "./pages/media/MediaPage.jsx";

import ServingHopeProgram from "./pages/serve/programs/ServingHopeProgram.jsx";
import EducationHopeProgram from "./pages/serve/programs/EducationHopeProgram.jsx";
import WellnessHopeProgram from "./pages/serve/programs/WellnessHopeProgram.jsx";
import OutdoorHopeProgram from "./pages/serve/programs/OutdoorHopeProgram.jsx";
import InternationalHopeProgram from "./pages/serve/programs/InternationalHopeProgram.jsx";
import FormPage from "./pages/form/FormPage.jsx";

import "./style.css";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "serve", element: <ServePage /> },
      { path: "connect", element: <ConnectPage /> },
      { path: "media", element: <MediaPage /> },

      { path: "serve/serving-hope", element: <ServingHopeProgram /> },
      { path: "serve/education-hope", element: <EducationHopeProgram /> },
      { path: "serve/wellness-hope", element: <WellnessHopeProgram /> },
      { path: "serve/outdoor-hope", element: <OutdoorHopeProgram /> },
      {
        path: "serve/international-hope",
        element: <InternationalHopeProgram />,
      },

      { path: "members", element: <FormPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
