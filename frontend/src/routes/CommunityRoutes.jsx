import { Routes, Route } from "react-router-dom";
import CommunityPage from "../features/communityPost/CommunityPage";
import CommunityDashboard from "../features/communityPost/pages/CommunityDashboard";
import CommunityProfile from "../features/communityPost/pages/CommunityProfile";

const CommunityRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CommunityDashboard />} />
      <Route path="/feed" element={<CommunityPage />} />
      <Route path="/profile" element={<CommunityProfile />} />
    </Routes>
  );
};

export default CommunityRoutes;