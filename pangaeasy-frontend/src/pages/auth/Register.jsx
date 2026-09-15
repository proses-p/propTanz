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
    <div className="min-h-screen bg-[#f7f8f6] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl">
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
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-600">Create account</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">Sign up</h2>
          </div>

          <div className="p-6 sm:p-8">
            <p className="mb-6 text-sm leading-6 text-slate-500">Create an account to manage hostels and view listings.</p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="name">Full name</label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={onChange("name")}
                    className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#FDBF2D] focus:bg-white ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
                    placeholder="John Doe"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#FDBF2D] focus:bg-white ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
                    placeholder="you@company.com"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={onChange("phone")}
                  className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#FDBF2D] focus:bg-white ${errors.phone ? 'border-red-400' : 'border-slate-200'}`}
                  placeholder="+1234567890"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={onChange("password")}
                      className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 pr-11 text-sm text-slate-800 outline-none transition focus:border-[#FDBF2D] focus:bg-white ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
                      placeholder="At least 8 characters"
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

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="password_confirmation">Confirm password</label>
                  <input
                    id="password_confirmation"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password_confirmation}
                    onChange={onChange("password_confirmation")}
                    className={`w-full rounded-xl border bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#FDBF2D] focus:bg-white ${errors.password_confirmation ? 'border-red-400' : 'border-slate-200'}`}
                    aria-invalid={!!errors.password_confirmation}
                  />
                  {errors.password_confirmation && <p className="mt-1.5 text-sm text-red-600">{errors.password_confirmation}</p>}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#FDBF2D] px-4 py-3 text-sm font-bold text-slate-900 shadow-[0_10px_24px_rgba(253,191,45,0.25)] transition hover:bg-[#FAF92A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-slate-900" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Create account'
                  )}
                </button>
              </div>

              <div className="text-center text-sm text-slate-500">
                Already have an account? <Link to="/login" className="font-semibold text-slate-700 hover:text-slate-900">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
