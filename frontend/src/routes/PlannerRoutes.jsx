// src/routes/PlannerRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "../features/academicPlanner/Dashboard";
import WeeklyView from "../features/academicPlanner/WeeklyView";  // ← Fixed typo
import MonthlyView from "../features/academicPlanner/MonthlyView";
import CreateTask from "../features/academicPlanner/CreateTask";
import PriorityTasks from "../features/academicPlanner/PriorityTasks";

const PlannerRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/view-tasks" element={<WeeklyView />} />
      <Route path="/monthly-view" element={<MonthlyView />} />
      <Route path="/create-task" element={<CreateTask />} />
      <Route path="/priority-tasks" element={<PriorityTasks />} />
    </Routes>
  );
};

export default PlannerRoutes;
