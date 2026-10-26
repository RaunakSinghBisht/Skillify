import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Home from "./pages/Home";
import Report from "./pages/Report";
import History from "./pages/History";
import ModifyResume from "./pages/ModifyResume";
import Protected from "./features/auth/components/Protected";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/report/history",
    element: (
      <Protected>
        <History />
      </Protected>
    ),
  },
  {
    path: "/report/:id",
    element: (
      <Protected>
        <Report />
      </Protected>
    ),
  },
  {
    path: "/resume/modify",
    element: (
      <Protected>
        <ModifyResume />
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;


