import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USER",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
    setErrors((s) => ({ ...s, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phone || !/^\+?[0-9\s-]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.password_confirmation) e.password_confirmation = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    try {
      await register(form);
      toast.success("Registration successful");
      navigate("/");
    } catch (err) {
      // Parse server validation errors
      const resp = err?.response?.data;
      if (resp?.errors) {
        const mapped = {};
        Object.keys(resp.errors).forEach((k) => (mapped[k] = resp.errors[k][0]));
        setErrors(mapped);
      }
      const msg = resp?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-blue-600 p-8">
          <div className="text-white max-w-xs space-y-4 animate-fade">
            <h3 className="text-2xl font-bold">Create your account</h3>
            <p className="text-sm opacity-90">Get started with PangaEasy — manage hostels, listings and bookings with ease.</p>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <h2 className="text-2xl font-semibold mb-2">Sign up</h2>
          <p className="text-sm text-gray-500 mb-6">Create an account to manage hostels and view listings.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">Full name</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={onChange("name")}
                  className={`w-full rounded border px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="John Doe"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  className={`w-full rounded border px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={onChange("phone")}
                className={`w-full rounded border px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="+1234567890"
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/*
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="role">Account type</label>
              <select
                id="role"
                value={form.role}
                onChange={onChange("role")}
                className="w-full rounded border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {ALLOWED_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={onChange("password")}
                    className={`w-full rounded border px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="At least 8 characters"
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

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password_confirmation">Confirm password</label>
                <input
                  id="password_confirmation"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={onChange("password_confirmation")}
                  className={`w-full rounded border px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.password_confirmation ? 'border-red-400' : 'border-gray-200'}`}
                  aria-invalid={!!errors.password_confirmation}
                />
                {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded hover:opacity-95 disabled:opacity-60 transition"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : null}
                <span>{loading ? 'Creating account...' : 'Create account'}</span>
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
