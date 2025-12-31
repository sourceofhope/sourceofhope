import "./style.css";

import React from "react";
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

import { CANONICAL } from "./routes.jsx";

export const router = createBrowserRouter([
  {
    path: CANONICAL.home,
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: CANONICAL.about, element: <AboutPage /> },
      { path: CANONICAL.serve, element: <ServePage /> },
      { path: CANONICAL.connect, element: <ConnectPage /> },
      { path: CANONICAL.media, element: <MediaPage /> },

      {
        path: `serve/${CANONICAL.servingHope}`,
        element: <ServingHopeProgram />,
      },
      {
        path: `serve/${CANONICAL.educationHope}`,
        element: <EducationHopeProgram />,
      },
      {
        path: `serve/${CANONICAL.wellnessHope}`,
        element: <WellnessHopeProgram />,
      },
      {
        path: `serve/${CANONICAL.outdoorHope}`,
        element: <OutdoorHopeProgram />,
      },
      {
        path: `serve/${CANONICAL.internationalHope}`,
        element: <InternationalHopeProgram />,
      },

      { path: `${CANONICAL.member}`, element: <FormPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
