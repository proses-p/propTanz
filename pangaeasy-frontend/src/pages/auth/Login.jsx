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
    <div className="min-h-screen bg-[#f7f8f6] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDBF2D] shadow-[0_10px_24px_rgba(253,191,45,0.28)]">
              <span className="text-xl font-black text-slate-900">P</span>
            </div>
            <div>
              <p className="text-2xl font-black tracking-[-0.05em] text-slate-900">PangaEasy</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_46px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-200 bg-[#FAF92A]/20 px-6 py-5 text-center sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-600">Welcome back</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">Sign in</h2>
          </div>

          <div className="p-6 sm:p-8">
            <p className="mb-6 text-sm leading-6 text-slate-500">Enter your credentials to access your account.</p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={onChange('email')}
                  className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#FDBF2D] focus:bg-white ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={onChange('password')}
                    className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 pr-11 text-sm text-slate-800 outline-none transition focus:border-[#FDBF2D] focus:bg-white ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
                    placeholder="Your password"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#FDBF2D] px-4 py-3 text-sm font-bold text-slate-900 shadow-[0_10px_24px_rgba(253,191,45,0.25)] transition hover:bg-[#FAF92A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <svg className="h-4 w-4 animate-spin text-slate-900" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : null}
                  <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                </button>

                <Link to="/register" className="text-sm font-semibold text-slate-700 transition hover:text-slate-900">Create account</Link>
              </div>

              <div className="pt-2 text-center text-sm text-slate-500">
                Forgot your password? <a className="font-semibold text-slate-700 hover:text-slate-900" href="#">Reset</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
