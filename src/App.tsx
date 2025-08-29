import { Outlet } from "react-router-dom";

import { Header } from "@components";

import "./App.scss";

const App = () => (
  <>
    <Header title="SWStarter" />
    <Outlet />
  </>
);

export default App;
