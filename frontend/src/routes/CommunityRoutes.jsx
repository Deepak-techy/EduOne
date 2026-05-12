import { Routes, Route } from "react-router-dom";
import CommunityPage from "../features/communityPost/CommunityPage";
import CommunityDashboard from "../features/communityPost/pages/CommunityDashboard";
import CommunityProfile from "../features/communityPost/pages/CommunityProfile";
import RoomLobby from "../features/collaboration/RoomLobby";
import VoiceRoom from "../features/collaboration/VoiceRoom";
import VideoMeetingRoom from "../features/collaboration/VideoMeetingRoom";

const CommunityRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CommunityDashboard />} />
      <Route path="/feed" element={<CommunityPage />} />
      <Route path="/profile" element={<CommunityProfile />} />
      <Route path="/room/:roomId" element={<RoomLobby />} />
      <Route path="/room/:roomId/voice" element={<VoiceRoom />} />
      <Route path="/room/:roomId/video" element={<VideoMeetingRoom />} />
    </Routes>
  );
};

export default CommunityRoutes;