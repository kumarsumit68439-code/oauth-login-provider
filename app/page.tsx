import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          OAuth Login Provider
        </h1>
        <p className="text-xl text-gray-600">
          Apni website ko kisi bhi website ke liye Google, GitHub, Firebase &
          Phone login provider banao — Client ID, Secret, Callback URL manage
          karo aur JWT / Bearer token generate karo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link
            href="/dashboard"
            className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100"
          >
            <h2 className="text-2xl font-semibold text-primary-600 mb-2">
              Dashboard
            </h2>
            <p className="text-gray-500">
              Naye OAuth clients banao, Client ID / Secret / Callback URL save
              karo aur test karo.
            </p>
          </Link>

          <Link
            href="/login"
            className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100"
          >
            <h2 className="text-2xl font-semibold text-primary-600 mb-2">
              Login / Signup
            </h2>
            <p className="text-gray-500">
              Google, GitHub se login karo. Choose Account page ke saath.
            </p>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white/80 rounded-xl text-left text-sm text-gray-700">
          <h3 className="font-semibold mb-2">Endpoints:</h3>
          <ul className="space-y-1 font-mono text-xs">
            <li>GET  /api/oauth/authorize</li>
            <li>POST /api/oauth/token</li>
            <li>GET  /api/userinfo</li>
            <li>GET/POST /api/clients</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
