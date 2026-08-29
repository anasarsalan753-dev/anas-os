import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { seedInitialData, subscribeProfile } from "./lib/data";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import Academics from "./pages/Academics";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import Habits from "./pages/Habits";
import Settings from "./pages/Settings";
import ComingSoon from "./pages/ComingSoon";

function Gate({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(undefined); // undefined = loading

  useEffect(() => {
    if (!user) return;
    seedInitialData(user.uid);
    const unsub = subscribeProfile(user.uid, setProfile);
    return unsub;
  }, [user]);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950 text-parchment-300 text-sm">
        Loading…
      </div>
    );
  }
  if (user === null) return <Login />;

  if (profile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950 text-parchment-300 text-sm">
        Loading…
      </div>
    );
  }
  if (profile === null) return <ProfileSetup />;

  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Gate><Dashboard /></Gate>} />
      <Route path="/calendar" element={<Gate><Calendar /></Gate>} />
      <Route
        path="/timetables"
        element={<Gate><ComingSoon title="Timetables" note="Custom timetables with schedule validation — coming soon." /></Gate>}
      />
      <Route path="/academics" element={<Gate><Academics /></Gate>} />
      <Route
        path="/study"
        element={<Gate><ComingSoon title="Study" note="Generic study programs with lecture progress tracking — coming soon." /></Gate>}
      />
      <Route path="/tasks" element={<Gate><Tasks /></Gate>} />
      <Route path="/habits" element={<Gate><Habits /></Gate>} />
      <Route path="/settings" element={<Gate><Settings /></Gate>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
