import Sidebar from "../../layout/SideBar";

const Dashboard = () => {
  return (
    <Sidebar>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white shadow rounded-lg">Card 1</div>
        <div className="p-6 bg-white shadow rounded-lg">Card 2</div>
        <div className="p-6 bg-white shadow rounded-lg">Card 3</div>
      </div>
    </Sidebar>
  );
};

export default Dashboard;
