import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import LandingPage from "./pages/PublicPages/LandingPage";
import LoginPage from "./pages/PublicPages/LoginPage";
import ConstituencyPage from "./pages/PublicPages/ConstituencyPage";
import IssueFeed from "./pages/PublicPages/IssueFeed";
import ReportIssue from "./pages/PublicPages/ReportIssue";
import IssueDescription from "./pages/PublicPages/IssueDescription";

//Authority pages
import AuthorityDashboard from "./pages/AdminPages/AuthorityDashboard";
import AuthorityAreaIssues from "./pages/AdminPages/AuthorityAreaIssues";
// Public route protection
import PrivateRoutes from "./pages/PublicPages/PrivateRoutes";
import AdminRoutes from "./pages/AdminPages/AdminRoutes";
import AuthorityIssueDescription from "./pages/AdminPages/AuthorityIssueDescription";

function App() {
  return (
    <BrowserRouter basename="/citycarehyd">
      <Routes>
        {/* Public routes */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes (require login) */}
        <Route element={<PrivateRoutes />}>
          <Route path="/constituencies" element={<ConstituencyPage />} />
          <Route
            path="/issues/constituency/:constituency"
            element={<IssueFeed />}
          />
          <Route path="/report-issue/:constituency" element={<ReportIssue />} />
          <Route path="/issue/:id" element={<IssueDescription />} />
        </Route>

        {/* Admin or local authority routes */}
        <Route element={<AdminRoutes />}>
          <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
          <Route path="/authority/area/:areaName" element={<AuthorityAreaIssues />} />
          <Route path="/authority/issue/:id" element={<AuthorityIssueDescription/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
