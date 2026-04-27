import { Routes, Route } from "react-router-dom";
import CommunityPage from "../features/communityPost/CommunityPage";

const CommunityRoutes = () => {
  return (
    <Routes>
      <Route index element={<CommunityPage />} />
    </Routes>
  );
};

export default CommunityRoutes;