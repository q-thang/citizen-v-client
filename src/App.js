import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles/global.scss";
import { useEffect } from "react";
import { refreshToken } from "./redux/actions/authAction";

import Header from "./components/Header";
import Alert from "./components/alert/Alert";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NewUnit from "./pages/NewUnit"

function App() {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return (
    <Router>
      <Alert />
      {auth.token && <Header />}
      <Routes>
        <Route exact path="/" element={auth.token ? <Home /> : <Login />} />
        <Route exact path="/newUnit" element={auth.token ? <NewUnit /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
