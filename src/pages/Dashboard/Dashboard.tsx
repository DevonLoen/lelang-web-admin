const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white shadow rounded-lg">Card 1</div>
        <div className="p-6 bg-white shadow rounded-lg">Card 2</div>
        <div className="p-6 bg-white shadow rounded-lg">Card 3</div>
      </div>
    </div>
  );
};

export default Dashboard;
