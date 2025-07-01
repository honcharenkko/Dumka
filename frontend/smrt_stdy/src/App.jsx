import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

import NavigationMenu from "./components/NavigationMenu.jsx";
import MainPage from "./pages/MainPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SmartCardPage from "./pages/generation_elements/generation_pages/SmartCardPage.jsx";
import SmartTestPage from "./pages/generation_elements/generation_pages/SmartTestPage.jsx";
import SmartSummaryPage from "./pages/generation_elements/generation_pages/SmartSummaryPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";
import ReadySmartPage from "./pages/ready_smart_objects/ReadySmartPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import FavoritePage from "./pages/FavoritePage.jsx";
import ActionMaterialPage from "./pages/ready_smart_objects/action_objects/ActionMaterialPage.jsx";
import SourcePage from "./pages/SourcePage.jsx";
import CreateMaterialsPage from "./pages/CreateMaterialsPage.jsx";
import AnswersPage from "./pages/AnswersPage.jsx";
import UploadMyDataPage from "./pages/UploadMyDataPage.jsx";
import KnowledgeBasePage from "./pages/KnowledgeBasePage.jsx";


// Обгортка для анімованих маршрутів
function AnimatedRoutes() {
  const location = useLocation();

  return (<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>

    {/* Публічні сторінки без навбару */}
    <Route path="/signup" element={<RegistrationPage />} />
    <Route path="/login" element={<LoginPage />} />

    {/* Головна сторінка з навбаром */}
    <Route
      path="/"
      element={
        <div className="flex flex-col min-h-screen">
          <NavigationMenu />
          <div className="flex-1 overflow-auto pt-4">
            <MainPage />
          </div>
        </div>
      }
    />
    <Route
      path="/faq"
      element={
        <div className="flex flex-col min-h-screen">
          <NavigationMenu />
          <div className="flex-1 overflow-auto pt-4">
            <AnswersPage />
          </div>
        </div>
      }
    />

    {/* Захищені сторінки */}
    <Route element={<ProtectedRoutes />}>
      <Route
        path="/*"
        element={
          <div className="flex flex-col min-h-screen">
            <NavigationMenu />
            <div className="flex-1 overflow-auto pt-4">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/create" element={<CreateMaterialsPage />} />
                  <Route path="/source" element={<SourcePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/favorites" element={<FavoritePage />} />
                  <Route path="/library" element={<KnowledgeBasePage />} />
                  <Route path="/upload_my_data" element={<UploadMyDataPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/smart_card" element={<SmartCardPage />} />
                  <Route path="/smart_test" element={<SmartTestPage />} />
                  <Route path="/smart_summary" element={<SmartSummaryPage />} />
                  <Route path="/materials/:materialId" element={<ReadySmartPage />} />
                  <Route path="/action/materials/:materialId" element={<ActionMaterialPage />} />
                </Routes>
              </AnimatePresence>
            </div>
          </div>
        }
      />
    </Route>

  </Routes>
</AnimatePresence>

  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
