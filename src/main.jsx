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
import CartPage from "./pages/cart/CartPage.jsx";

import ServingHopeProgram from "./pages/serve/programs/ServingHopeProgram.jsx";
import EducationHopeProgram from "./pages/serve/programs/EducationHopeProgram.jsx";
import WellnessHopeProgram from "./pages/serve/programs/WellnessHopeProgram.jsx";
import OutdoorHopeProgram from "./pages/serve/programs/OutdoorHopeProgram.jsx";
import InternationalHopeProgram from "./pages/serve/programs/InternationalHopeProgram.jsx";

import FormPage from "./pages/form/FormPage.jsx";
import StorefrontPage from "./pages/storefront/StorefrontPage.jsx";
import { CANONICAL } from "./routes.jsx";
import ProductPage from "./pages/storefront/ProductPage.jsx";

export const router = createBrowserRouter([
  {
    path: CANONICAL.home.absolute,
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },

      { path: CANONICAL.about.relative, element: <AboutPage /> },
      { path: CANONICAL.serve.relative, element: <ServePage /> },
      { path: CANONICAL.connect.relative, element: <ConnectPage /> },
      { path: CANONICAL.media.relative, element: <MediaPage /> },

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

      { path: CANONICAL.member.relative, element: <FormPage /> },
      { path: CANONICAL.storefront.relative, element: <StorefrontPage /> },
      {
        path: `${CANONICAL.storefront.products.relative}/:slug`,
        element: <ProductPage />,
      },
      { path: `${CANONICAL.storefront.cart.relative}`, element: <CartPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
