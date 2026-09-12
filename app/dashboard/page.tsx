"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  createdAt: string;
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [testResult, setTestResult] = useState("");

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          redirectUris: [redirectUri],
        }),
      });
      if (res.ok) {
        setMessage("Client created successfully!");
        setName("");
        setRedirectUri("");
        fetchClients();
      } else {
        const err = await res.json();
        setMessage(err.error || "Failed");
      }
    } catch {
      setMessage("Error creating client");
    }
    setLoading(false);
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm("Delete this client?")) return;
    await fetch(`/api/clients/${clientId}`, { method: "DELETE" });
    fetchClients();
  };

  const handleTestLogin = (client: Client) => {
    const uri = client.redirectUris[0] || "https://example.com/callback";
    const url = `/api/oauth/authorize?client_id=${client.clientId}&redirect_uri=${encodeURIComponent(
      uri
    )}&response_type=code&scope=openid%20profile%20email&state=test123`;
    window.open(url, "_blank");
    setTestResult(
      `Test started. After login you will be redirected to: ${uri} with ?code=...`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">OAuth Provider Dashboard</h1>
        <Link href="/" className="text-primary-600 hover:underline text-sm">
          Home
        </Link>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Create Client Form */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Add New OAuth Client</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="My Cool App"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Callback / Redirect URL
              </label>
              <input
                type="url"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
                required
                placeholder="https://your-app.com/callback"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Client (generate Client ID + Secret)"}
            </button>
            {message && (
              <p className="text-sm text-green-600">{message}</p>
            )}
          </form>
        </section>

        {/* Clients List */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Registered Clients</h2>
          {clients.length === 0 ? (
            <p className="text-gray-500">No clients yet. Create one above.</p>
          ) : (
            <div className="space-y-4">
              {clients.map((c) => (
                <div
                  key={c.clientId}
                  className="border border-gray-200 rounded-xl p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{c.name}</h3>
                      <p className="text-xs text-gray-400">
                        Created: {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTestLogin(c)}
                        className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200"
                      >
                        Test Login
                      </button>
                      <button
                        onClick={() => handleDelete(c.clientId)}
                        className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-sm font-mono bg-gray-50 p-3 rounded-lg">
                    <div>
                      <span className="text-gray-500">Client ID: </span>
                      <span className="select-all">{c.clientId}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Client Secret: </span>
                      <span className="select-all">{c.clientSecret}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Callback URLs: </span>
                      <span>{c.redirectUris.join(", ")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {testResult && (
            <p className="mt-4 text-sm text-blue-600">{testResult}</p>
          )}
        </section>

        {/* How to use */}
        <section className="bg-white rounded-2xl shadow p-6 text-sm text-gray-700">
          <h2 className="text-lg font-semibold mb-3">How other websites use this</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Create a client above and copy Client ID + Secret + Callback URL</li>
            <li>
              Redirect users to:{" "}
              <code className="bg-gray-100 px-1 rounded">
                /api/oauth/authorize?client_id=...&redirect_uri=...&response_type=code&scope=openid%20profile%20email
              </code>
            </li>
            <li>User logs in with Google / GitHub (choose account page)</li>
            <li>You receive ?code=... on your callback URL</li>
            <li>
              Exchange code for tokens via POST /api/oauth/token (send client_id,
              client_secret, code, redirect_uri, grant_type=authorization_code)
            </li>
            <li>You get access_token (JWT) + bearer_token</li>
            <li>Call /api/userinfo with Authorization: Bearer <token></li>
          </ol>
        </section>
      </main>
    </div>
  );
}
