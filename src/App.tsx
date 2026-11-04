import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { useRole } from "./lib/role";
import { ROLES } from "./lib/labels";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import ApplicantProjects from "./pages/ApplicantProjects";
import ApplicantFinance from "./pages/ApplicantFinance";
import ApplicantSupport from "./pages/ApplicantSupport";
import NewRequestWizard from "./pages/NewRequestWizard";
import InstallerDashboard from "./pages/InstallerDashboard";
import InstallerProjects from "./pages/InstallerProjects";
import InstallerProfile from "./pages/InstallerProfile";
import InspectorQueue from "./pages/InspectorQueue";
import InspectorReview from "./pages/InspectorReview";
import InspectorHistory from "./pages/InspectorHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";
import AdminInstallers from "./pages/AdminInstallers";
import AdminFinance from "./pages/AdminFinance";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AdminEvaluation from "./pages/AdminEvaluation";
import SatbaDashboard from "./pages/SatbaDashboard";
import SatbaProjects from "./pages/SatbaProjects";
import SatbaReports from "./pages/SatbaReports";
import SatbaApi from "./pages/SatbaApi";
import ProjectDetail from "./pages/ProjectDetail";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function HomeRedirect() {
  const { role } = useRole();
  return <Navigate to={ROLES[role].home} replace />;
}

function ShellRoutes() {
  return (
    <AppShell>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />

        <Route path="/applicant" element={<ApplicantDashboard />} />
        <Route path="/applicant/projects" element={<ApplicantProjects />} />
        <Route path="/applicant/new" element={<NewRequestWizard />} />
        <Route path="/applicant/finance" element={<ApplicantFinance />} />
        <Route path="/applicant/support" element={<ApplicantSupport />} />

        <Route path="/installer" element={<InstallerDashboard />} />
        <Route path="/installer/projects" element={<InstallerProjects />} />
        <Route path="/installer/profile" element={<InstallerProfile />} />

        <Route path="/inspector" element={<InspectorQueue />} />
        <Route path="/inspector/history" element={<InspectorHistory />} />
        <Route path="/inspector/review/:id" element={<InspectorReview />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/installers" element={<AdminInstallers />} />
        <Route path="/admin/finance" element={<AdminFinance />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/evaluation" element={<AdminEvaluation />} />

        <Route path="/satba" element={<SatbaDashboard />} />
        <Route path="/satba/projects" element={<SatbaProjects />} />
        <Route path="/satba/reports" element={<SatbaReports />} />
        <Route path="/satba/api" element={<SatbaApi />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ShellRoutes />} />
    </Routes>
  );
}
