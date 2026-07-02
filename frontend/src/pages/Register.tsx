import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/endpoints";
import { apiMessage } from "../api/client";
import { StatusMessage } from "../components/StatusMessage";
import { useAuthStore } from "../store/authStore";

export const Register = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState({
    name: "",
    email: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/\d/.test(form.password) || !/[^A-Za-z0-9]/.test(form.password)) {
      setError("Password needs uppercase, lowercase, number, and symbol characters.");
      return;
    }
    setLoading(true);
    try {
      const session = await authApi.register(form);
      setSession(session.user, session.token);
      navigate("/");
    } catch (err) {
      setError(apiMessage(err, "Unable to register"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-skyglass px-4 py-10 text-ink">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Create Account</h1>
        {(["name", "email", "timezone", "password"] as const).map((field) => (
          <div key={field}>
            <label className="mb-1 block text-sm font-medium capitalize" htmlFor={field}>
              {field}
            </label>
            <input
              id={field}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
              required
            />
          </div>
        ))}
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        <button className="w-full rounded-md bg-moss px-4 py-2 font-medium text-white hover:bg-moss/90" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-medium text-moss underline-offset-4 hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
};
