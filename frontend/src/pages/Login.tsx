import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { authApi } from "../api/endpoints";
import { apiMessage } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { StatusMessage } from "../components/StatusMessage";

export const Login = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("ada@example.com");
  const [password, setPassword] = useState("DemoPass123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await authApi.login({ email, password });
      setSession(session.user, session.token);
      navigate("/");
    } catch (err) {
      setError(apiMessage(err, "Unable to log in"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-skyglass px-4 py-10 text-ink">
      <section className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <CalendarCheck className="h-8 w-8 text-moss" aria-hidden="true" />
          <h1 className="text-2xl font-semibold">Scheduling System</h1>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
              required
            />
          </div>
          {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
          <button
            className="w-full rounded-md bg-moss px-4 py-2 font-medium text-white hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-sm text-slate-600">
            Need an account?{" "}
            <Link className="font-medium text-moss underline-offset-4 hover:underline" to="/register">
              Register
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};
