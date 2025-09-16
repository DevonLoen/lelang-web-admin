import { Outlet } from "react-router-dom";
import Sidebar from "../layout/Sidebar";

const AdminLayout = () => {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};

export default AdminLayout;
