import React from "react";
// @webspec:imports:start
import Home from "./pages/Home";
// @webspec:imports:end

export type AppRoute = { path: string; element: React.ReactNode };

export const routes: AppRoute[] = [
  // @webspec:routes:start
  { path: "/", element: <Home /> },
  // @webspec:routes:end
];
