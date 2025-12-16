export default function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-slate-800 p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-4">Voter Dashboard</h1>
        <p className="text-slate-400 mb-6">
          You are authenticated and eligible to vote.
        </p>

        <a
          href="/vote"
          className="inline-block bg-green-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Cast Vote
        </a>
      </div>
    </div>
  );
}
