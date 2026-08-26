import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ROLE_ADMIN } from "../../constants/roles";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
    setErrors((s) => ({ ...s, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Enter your password.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email: form.email, password: form.password });
      const user = res?.data?.data?.user;
      toast.success("Signed in successfully");

      const role = user?.role;
      navigate(role === ROLE_ADMIN ? "/admin" : "/dashboard");
    } catch (err) {
      const resp = err?.response?.data;
      if (resp?.errors) {
        const mapped = {};
        Object.keys(resp.errors).forEach((k) => (mapped[k] = resp.errors[k][0]));
        setErrors(mapped);
      }
      const msg = resp?.message || "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-blue-600 p-8">
          <div className="text-white max-w-xs space-y-4">
            <h3 className="text-2xl font-bold">Welcome back</h3>
            <p className="text-sm opacity-90">Sign in to manage hostels, view bookings and more.</p>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <h2 className="text-2xl font-semibold mb-2">Sign in</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your credentials to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={onChange('email')}
                className={`w-full rounded border px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={onChange('password')}
                  className={`w-full rounded border px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Your password"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 rounded hover:opacity-95 disabled:opacity-60 transition"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : null}
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              </button>

              <Link to="/register" className="text-sm text-blue-600">Create account</Link>
            </div>

            <div className="text-center text-sm text-gray-500">
              Forgot your password? <a className="text-blue-600" href="#">Reset</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
