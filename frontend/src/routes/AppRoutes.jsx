import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div>Halaman Login (Fase 9)</div>} />
        <Route path="/" element={<div>Dashboard (Fase 9)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
