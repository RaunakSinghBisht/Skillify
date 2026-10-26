import { RouterProvider } from "react-router";
import router from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { ReportProvider } from "./features/report/report.context.jsx";
import { ResumeProvider } from "./features/resume/resume.context.jsx";

const App = () => {
  return (
    <AuthProvider>
      <ReportProvider>
        <ResumeProvider>
          <RouterProvider router={router} />
        </ResumeProvider>
      </ReportProvider>
    </AuthProvider>
  );
};

export default App;