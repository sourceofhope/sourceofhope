import "./style.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout.jsx";
import ErrorBoundary from "./pages/ErrorBoundary.jsx";

import HomePage from "./pages/home/HomePage.jsx";
import AboutPage from "./pages/about/AboutPage.jsx";
import TeamPage from "./pages/about/TeamPage.jsx";
import ServePage from "./pages/serve/ServePage.jsx";
import ConnectPage from "./pages/connect/ConnectPage.jsx";
import MediaPage from "./pages/media/MediaPage.jsx";
import CartPage from "./pages/cart/CartPage.jsx";
import CartSuccessPage from "./pages/cart/CartSuccessPage.jsx";

import ServingHopeProgram from "./pages/serve/programs/ServingHopeProgram.jsx";
import EducationHopeProgram from "./pages/serve/programs/EducationHopeProgram.jsx";
import WellnessHopeProgram from "./pages/serve/programs/WellnessHopeProgram.jsx";
import OutdoorHopeProgram from "./pages/serve/programs/OutdoorHopeProgram.jsx";
import InternationalHopeProgram from "./pages/serve/programs/InternationalHopeProgram.jsx";

import FormPage from "./pages/form/FormPage.jsx";
import StorefrontPage from "./pages/storefront/StorefrontPage.jsx";
import { CANONICAL } from "./routes.jsx";
import ProductPage from "./pages/storefront/ProductPage.jsx";
import PodcastPage from "./pages/media/PodcastPage.jsx";
import PressPage from "./pages/media/PressPage.jsx";
import { HelmetProvider } from "react-helmet-async";
import MemberPage from "./pages/about/MemberPage.jsx";

export const router = createBrowserRouter([
  {
    path: CANONICAL.home.absolute,
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },

      {
        path: CANONICAL.about.relative,
        element: <AboutPage />,
      },
      {
        path: CANONICAL.about.team.relative,
        element: <TeamPage />,
      },
      {
        path: CANONICAL.about.member.relative,
        element: <MemberPage />,
      },

      {
        path: CANONICAL.serve.relative,
        element: <ServePage />,
      },
      {
        path: CANONICAL.serve.servingHope.relative,
        element: <ServingHopeProgram />,
      },
      {
        path: CANONICAL.serve.educationHope.relative,
        element: <EducationHopeProgram />,
      },
      {
        path: CANONICAL.serve.wellnessHope.relative,
        element: <WellnessHopeProgram />,
      },
      {
        path: CANONICAL.serve.outdoorHope.relative,
        element: <OutdoorHopeProgram />,
      },
      {
        path: CANONICAL.serve.internationalHope.relative,
        element: <InternationalHopeProgram />,
      },

      {
        path: CANONICAL.connect.relative,
        element: <ConnectPage />,
      },

      {
        path: CANONICAL.media.relative,
        element: <MediaPage />,
      },
      {
        path: CANONICAL.media.podcast.relative,
        element: <PodcastPage />,
      },
      {
        path: CANONICAL.media.press.relative,
        element: <PressPage />,
      },

      {
        path: CANONICAL.member.relative,
        element: <FormPage />,
      },

      {
        path: CANONICAL.storefront.relative,
        element: <StorefrontPage />,
      },
      {
        path: CANONICAL.storefront.product.relative,
        element: <ProductPage />,
      },
      { path: CANONICAL.storefront.cart.relative, element: <CartPage /> },

      {
        path: CANONICAL.storefront.success.relative,
        element: <CartSuccessPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>,
);
