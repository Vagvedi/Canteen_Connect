const Home = () => (
  <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
    <header className="text-center space-y-2">
      <h1 className="text-3xl font-bold">Welcome to Canteen Connect</h1>
      <p className="text-gray-600">
        Browse the daily menu, place orders, and track status in real-time.
      </p>
    </header>
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card p-4">
        <h3 className="font-semibold">Students</h3>
        <p className="text-sm text-gray-600">Add items to cart and checkout quickly.</p>
      </div>
      <div className="card p-4">
        <h3 className="font-semibold">Staff</h3>
        <p className="text-sm text-gray-600">See incoming orders and update status.</p>
      </div>
      <div className="card p-4">
        <h3 className="font-semibold">Live updates</h3>
        <p className="text-sm text-gray-600">Sockets notify when orders move forward.</p>
      </div>
    </div>
  </div>
);

export default Home;

