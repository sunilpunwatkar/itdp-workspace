export default function AIEnginePage() {
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-4">
        🤖 ITDP AI Decision Engine
      </h1>

      <p className="text-gray-600 mb-8">
        Intelligent Trading Decision Science Platform
      </p>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="border rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold">
            Stock Input
          </h2>

          <input
            placeholder="Enter Stock Symbol"
            className="border p-3 mt-4 w-full rounded"
          />

          <button
            className="mt-4 bg-black text-white px-5 py-2 rounded"
          >
            Analyze
          </button>
        </div>


        <div className="border rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold">
            ITDP Score
          </h2>

          <div className="text-5xl mt-5">
            --
          </div>

          <p>
            Waiting for analysis
          </p>
        </div>


        <div className="border rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold">
            Decision
          </h2>

          <div className="text-xl mt-5">
            NO SIGNAL
          </div>
        </div>

      </div>

    </div>
  );
}