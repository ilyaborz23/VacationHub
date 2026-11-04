import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { GuestOnly, HomeRedirect, RequireAuth } from './components/RouteGuards'
import AboutPage from './pages/AboutPage'
import AddVacationPage from './pages/AddVacationPage'
import AdminPage from './pages/AdminPage'
import AskPage from './pages/AskPage'
import EditVacationPage from './pages/EditVacationPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RecommendationPage from './pages/RecommendationPage'
import RegisterPage from './pages/RegisterPage'
import ReportPage from './pages/ReportPage'
import VacationsPage from './pages/VacationsPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/about" element={<AboutPage />} />
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<RequireAuth role="user" />}>
          <Route path="/vacations" element={<VacationsPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/ask" element={<AskPage />} />
        </Route>
        <Route element={<RequireAuth role="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/add" element={<AddVacationPage />} />
          <Route path="/admin/edit/:id" element={<EditVacationPage />} />
          <Route path="/admin/report" element={<ReportPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
