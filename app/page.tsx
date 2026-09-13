import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Own Login System + Provider
        </h1>
        <p className="text-xl text-gray-600">
          Apna complete login system (Email/Password + Google + GitHub) aur
          dusri websites ke liye OAuth 2.0 Login Provider — Client ID, Secret,
          Callback URL, JWT & Bearer tokens.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          <Link
            href="/signup"
            className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-primary-600 mb-2">
              Sign Up
            </h2>
            <p className="text-gray-500 text-sm">
              Naya account banao – Email/Password, Google ya GitHub se.
            </p>
          </Link>

          <Link
            href="/login"
            className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-primary-600 mb-2">
              Login
            </h2>
            <p className="text-gray-500 text-sm">
              Choose account page – Email, Google, GitHub.
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-primary-600 mb-2">
              Dashboard
            </h2>
            <p className="text-gray-500 text-sm">
              OAuth clients manage karo, test login button.
            </p>
          </Link>
        </div>

        <div className="mt-10 p-6 bg-white/80 rounded-xl text-left text-sm text-gray-700 space-y-3">
          <h3 className="font-semibold">Yeh system kya karta hai?</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Own Login System</strong> – Users is site pe signup/login
              kar sakte hain (Email + Social)
            </li>
            <li>
              <strong>Login Provider</strong> – Dusri websites is system se
              login le sakti hain (OAuth 2.0)
            </li>
            <li>Client ID / Secret / Callback URL save + Test button</li>
            <li>JWT + Bearer token generate hote hain</li>
          </ul>

          <h3 className="font-semibold pt-2">Endpoints:</h3>
          <ul className="font-mono text-xs space-y-1">
            <li>POST /api/register — Signup</li>
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
