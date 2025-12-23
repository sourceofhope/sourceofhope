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

const PageMap = {
  home: <HomePage />,

  about: <AboutPage />,

  serve: <ServePage />,

  connect: <ConnectPage />,

  media: <MediaPage />,

  servingHope: <ServingHopeProgram />,
  educationHope: <EducationHopeProgram />,
  wellnessHope: <WellnessHopeProgram />,
  outdoorHope: <OutdoorHopeProgram />,
  internationalHope: <InternationalHopeProgram />,

  member: <FormPage />,
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
