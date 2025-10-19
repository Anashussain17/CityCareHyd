import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import LandingPage from "./pages/PublicPages/LandingPage";
import LoginPage from "./pages/PublicPages/LoginPage";
import ConstituencyPage from "./pages/PublicPages/ConstituencyPage";
import IssueFeed from "./pages/PublicPages/IssueFeed";
import ReportIssue from "./pages/PublicPages/ReportIssue";
import IssueDescription from "./pages/PublicPages/IssueDescription";

// Public route protection
import PrivateRoutes from "./pages/PublicPages/PrivateRoutes";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
     

        {/* Protected routes (require login) */}
        <Route element={<PrivateRoutes />}>
          <Route path="/constituencies" element={<ConstituencyPage />} />
          <Route path="/issues/constituency/:constituency" element={<IssueFeed />} />
          <Route path="/report-issue/:constituency" element={<ReportIssue />} />
          <Route path="/issue/:id" element={<IssueDescription />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
