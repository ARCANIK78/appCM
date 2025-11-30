import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import PasswordReset from "./pages/auth/PasswordReset";
import Register from "./pages/auth/Register";
import UpdatePassword from "./pages/auth/UpdatePassword";
import RegMedidor from "./pages/regMedidor/regMedidor";
import Historial from "./pages/historial/historial";
import Profile from "./pages/profile/profile";

const App = () => {
  return (
    <>
      <NavBar />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ padding: "10px" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Routes>
            <Route element={<AuthRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="regMedidor" element={<RegMedidor />}/>
              <Route path="/Historial" element={<Historial />} />
              <Route path="/Perfil" element={<Profile />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/passwordreset" element={<PasswordReset />} />
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
        </div>
      </Container>
    </>
  );
};

export default App;
