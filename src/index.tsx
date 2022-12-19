import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import FeatureFlagsList from "./pages/feature-flag-list";
import FeatureFlagsNew from "./pages/feature-flag-new";
import { QueryClient, QueryClientProvider } from "react-query";
import FeatureFlagsToggles from "./pages/feature-flags-toggle";
import Accounts from "./pages/accounts";
import Projects from "./pages/projects";
import EntitiesDetails from "./pages/entities-details";
import History from "./pages/history";
import ExperimentNew from "./pages/experiment-new";
import EnvVariableNew from "./pages/env-variables-new";
import EnvVariables from "./pages/env-variables";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <div> Hello</div>,
      },
      {
        path: "/feature-flags",
        element: <FeatureFlagsList />,
      },
      {
        path: "/accounts",
        element: <Accounts />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/history/:name",
        element: <History />,
      },
      {
        path: "/entities/details/:type/:id",
        element: <EntitiesDetails />,
      },
      {
        path: "/feature-flags/new",
        element: <FeatureFlagsNew />,
      },
      {
        path: "/experiment/new",
        element: <ExperimentNew />,
      },
      {
        path: "/envvar/new",
        element: <EnvVariableNew />,
      },
      {
        path: "/envvar",
        element: <EnvVariables />,
      },
      {
        path: "/feature-flags/toggles/:toggleKey",
        element: <FeatureFlagsToggles />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
