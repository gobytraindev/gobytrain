export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-6">
      <h1 className="text-4xl font-bold text-center">Welcome to GoByTrain</h1>
      <p className="text-lg text-center text-gray-600">
        Your train journey starts here.
      </p>

      <div className="flex space-x-2 mt-8">
        <input
          type="text"
          placeholder="From..."
          className="border border-gray-300 rounded px-4 py-2 w-40"
        />
        <input
          type="text"
          placeholder="To..."
          className="border border-gray-300 rounded px-4 py-2 w-40"
        />
        <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
          Search
        </button>
      </div>
    </main>
  );
}
