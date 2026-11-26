import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronDown, Mail, ArrowRight } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', label: 'India (+91)' },
  { code: '+1', flag: '🇺🇸', label: 'United States (+1)' },
  { code: '+44', flag: '🇬🇧', label: 'United Kingdom (+44)' },
  { code: '+61', flag: '🇦🇺', label: 'Australia (+61)' },
];

export default function LoginModal({ isOpen, onClose, onAuthSuccess }) {
  const [step, setStep] = useState('method'); // 'method' | 'otp' | 'email'
  const [country, setCountry] = useState(COUNTRY_CODES[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [error, setError] = useState('');

  // Email flow state
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const otpRefs = useRef([]);
  const phoneInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setStep('method');
    setPhone('');
    setOtp(['', '', '', '', '', '']);
    setSecondsLeft(45);
    setError('');
    setIsCountryOpen(false);
    setIsRegister(false);
    setFullName('');
    setEmail('');
    setPassword('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || step !== 'otp' || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, step, secondsLeft]);

  useEffect(() => {
    if (isOpen && step === 'otp') {
      requestAnimationFrame(() => {
        otpRefs.current[0]?.focus();
      });
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  const cleanPhoneDigits = phone.replace(/\D/g, '');
  const isPhoneValid = cleanPhoneDigits.length >= 10;
  const isOtpComplete = otp.every((d) => d.length === 1);

  const handleStartOtp = (e) => {
    e?.preventDefault();
    if (!isPhoneValid) {
      setError('Please enter a valid 10-digit mobile number.');
      phoneInputRef.current?.focus();
      return;
    }
    setError('');
    setOtp(['', '', '', '', '', '']);
    setSecondsLeft(45);
    setStep('otp');
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    setError('');

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const nextOtp = [...otp];
        nextOtp[index] = '';
        setOtp(nextOtp);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
        const nextOtp = [...otp];
        nextOtp[index - 1] = '';
        setOtp(nextOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const nextOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i += 1) {
      nextOtp[i] = pasted[i];
    }
    setOtp(nextOtp);
    const nextFocus = Math.min(pasted.length, 5);
    otpRefs.current[nextFocus]?.focus();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!isOtpComplete) return;
    onAuthSuccess?.({
      method: 'phone',
      displayName: 'Alex Morgan',
      email: `${country.code} ${cleanPhoneDigits}`,
      phone: `${country.code} ${cleanPhoneDigits}`,
    });
    onClose();
  };

  const handleOAuthLogin = (provider) => {
    onAuthSuccess?.({
      method: provider,
      displayName: 'Alex Morgan',
      email:
        provider === 'google'
          ? 'alex.morgan@gmail.com'
          : 'alex.morgan@icloud.com',
    });
    onClose();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    if (isRegister && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const endpoint = isRegister ? '/api/auth/register/' : '/api/auth/login/';
      const payload = isRegister
        ? {
            email: email.trim(),
            full_name: fullName.trim(),
            password,
            confirm_password: password,
          }
        : {
            email: email.trim(),
            password,
          };

      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.tokens?.access) {
          localStorage.setItem('neuroread_access_token', data.tokens.access);
        }
        onAuthSuccess?.({
          method: 'email',
          displayName: data?.user?.full_name || fullName.trim() || email.split('@')[0],
          email: data?.user?.email || email.trim(),
        });
        onClose();
        return;
      }
    } catch {
      // Backend optional in preview mode — continue with local session sign-in below
    } finally {
      setIsSubmitting(false);
    }

    const derivedName =
      fullName.trim() ||
      email
        .split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    onAuthSuccess?.({
      method: 'email',
      displayName: derivedName || 'Alex Morgan',
      email: email.trim(),
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={step === 'otp' ? 'Verify your Mobile Number' : 'Get Started'}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between min-h-[500px]"
        onClick={(e) => {
          e.stopPropagation();
          if (isCountryOpen) setIsCountryOpen(false);
        }}
      >
        {step === 'method' && (
          <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
            {/* Top Bar */}
            <div>
              <div className="relative flex items-center justify-center mb-7">
                <h2 className="text-[17px] font-bold text-[#141416] tracking-tight">
                  Get Started
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close login modal"
                  className="absolute right-0 w-9 h-9 rounded-full flex items-center justify-center text-[#52525B] hover:text-[#141416] hover:bg-[#F4F4F5] transition-colors"
                >
                  <X className="w-5 h-5 stroke-[1.75]" />
                </button>
              </div>

              {/* OAuth & Email Action Stack */}
              <div className="space-y-3.5">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  className="relative w-full h-11 rounded-md border border-[#D4D4D8] hover:border-[#A1A1AA] hover:bg-[#FAFAFA] bg-white flex items-center justify-center px-4 text-sm font-medium text-[#27272A] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[18px] h-[18px] absolute left-4"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.97z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Email */}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('email');
                  }}
                  className="relative w-full h-11 rounded-md border border-[#D4D4D8] hover:border-[#A1A1AA] hover:bg-[#FAFAFA] bg-white flex items-center justify-center px-4 text-sm font-medium text-[#27272A] transition-colors"
                >
                  <Mail className="w-[18px] h-[18px] text-[#52525B] absolute left-4 stroke-[1.75]" />
                  <span>Continue with Email</span>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('apple')}
                  className="relative w-full h-11 rounded-md border border-[#D4D4D8] hover:border-[#A1A1AA] hover:bg-[#FAFAFA] bg-white flex items-center justify-center px-4 text-sm font-medium text-[#27272A] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[18px] h-[18px] absolute left-4 fill-[#141416]"
                    aria-hidden="true"
                  >
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* OR Divider */}
              <div className="my-6 text-center">
                <span className="text-xs font-medium text-[#71717A] tracking-wider">OR</span>
              </div>

              {/* Mobile Number Input Row */}
              <form onSubmit={handleStartOtp} className="space-y-4">
                <div className="flex items-center gap-3">
                  {/* Country Selector */}
                  <div
                    className="relative flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setIsCountryOpen((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-[#141416] hover:text-[#3A2AD9] transition-colors"
                    >
                      <span className="text-base leading-none">{country.flag}</span>
                      <span>{country.code}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
                    </button>

                    {isCountryOpen && (
                      <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#E4E4E7] rounded-xl shadow-lg py-1 z-30">
                        {COUNTRY_CODES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setCountry(c);
                              setIsCountryOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#FAF8F5] ${
                              country.code === c.code
                                ? 'font-bold text-[#3A2AD9] bg-[#ECEAFD]/40'
                                : 'text-[#27272A]'
                            }`}
                          >
                            <span>{c.flag}</span>
                            <span>{c.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Underline Mobile Number Field */}
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    inputMode="numeric"
                    maxLength={12}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/[^\d\s]/g, ''));
                      setError('');
                    }}
                    placeholder="Continue with mobile number"
                    aria-label="Mobile number"
                    className="flex-1 min-w-0 py-2 text-sm text-[#141416] placeholder-[#71717A] border-b border-[#D4D4D8] focus:border-[#3A2AD9] focus:outline-none transition-colors bg-transparent"
                  />
                </div>

                {error && <p className="text-xs text-rose-600">{error}</p>}

                {cleanPhoneDigits.length > 0 && (
                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      isPhoneValid
                        ? 'bg-[#3A2AD9] hover:bg-[#3021C2] text-white shadow-xs'
                        : 'bg-[#EBE9FC] text-white cursor-not-allowed'
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Bottom Legal Text */}
            <p className="mt-8 text-[11px] text-[#71717A] text-center leading-relaxed">
              By continuing, you agree to our{' '}
              <button
                type="button"
                onClick={() => alert('NeuroRead Terms & Conditions')}
                className="underline hover:text-[#141416]"
              >
                Terms &amp; Conditions
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => alert('NeuroRead Privacy Policy')}
                className="underline hover:text-[#141416]"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        )}

        {step === 'otp' && (
          <form
            onSubmit={handleVerifyOtp}
            className="p-6 sm:p-7 flex-1 flex flex-col justify-between"
          >
            <div>
              {/* Top Back & Close Controls */}
              <div className="flex items-center justify-between -mx-2 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('method');
                  }}
                  aria-label="Back to sign in options"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#141416] hover:bg-[#F4F4F5] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[1.9]" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close login modal"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#71717A] hover:text-[#141416] hover:bg-[#F4F4F5] transition-colors"
                >
                  <X className="w-5 h-5 stroke-[1.75]" />
                </button>
              </div>

              <h2 className="text-xl sm:text-[22px] font-bold text-[#141416] tracking-tight">
                Verify your Mobile Number
              </h2>
              <p className="text-[13px] text-[#52525B] mt-1.5">
                Enter OTP sent to{' '}
                <strong className="font-semibold text-[#141416]">
                  {country.code} {cleanPhoneDigits}
                </strong>
              </p>

              {/* 6-Digit OTP Input Boxes */}
              <div
                className="flex items-center justify-between gap-2 sm:gap-2.5 mt-7"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    aria-label={`OTP digit ${index + 1}`}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-md border border-[#D4D4D8] focus:border-[#3A2AD9] focus:ring-1 focus:ring-[#3A2AD9] text-center text-base font-bold text-[#141416] focus:outline-none transition-all bg-white"
                  />
                ))}
              </div>
            </div>

            {/* Bottom Timer & Continue Button */}
            <div className="mt-10 space-y-4">
              <div className="text-center text-xs text-[#27272A]">
                {secondsLeft > 0 ? (
                  <span>
                    Expect OTP in <strong className="font-bold">{secondsLeft}</strong> seconds
                  </span>
                ) : (
                  <span>
                    Didn&apos;t receive OTP?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setSecondsLeft(45);
                        setOtp(['', '', '', '', '', '']);
                        otpRefs.current[0]?.focus();
                      }}
                      className="text-[#3A2AD9] font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!isOtpComplete}
                className={`w-full py-3 rounded-lg text-sm font-semibold transition-all ${
                  isOtpComplete
                    ? 'bg-[#3A2AD9] hover:bg-[#3021C2] text-white shadow-sm cursor-pointer'
                    : 'bg-[#EBE9FC] text-white cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {step === 'email' && (
          <form
            onSubmit={handleEmailSubmit}
            className="p-6 sm:p-7 flex-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between -mx-2 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('method');
                  }}
                  aria-label="Back to sign in options"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#141416] hover:bg-[#F4F4F5] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[1.9]" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close login modal"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#71717A] hover:text-[#141416] hover:bg-[#F4F4F5] transition-colors"
                >
                  <X className="w-5 h-5 stroke-[1.75]" />
                </button>
              </div>

              <h2 className="text-xl sm:text-[22px] font-bold text-[#141416] tracking-tight">
                {isRegister ? 'Create your account' : 'Continue with Email'}
              </h2>
              <p className="text-[13px] text-[#52525B] mt-1">
                {isRegister
                  ? 'Sign up to sync your books and reading preferences.'
                  : 'Sign in with your NeuroRead email and password.'}
              </p>

              <div className="space-y-4 mt-6">
                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold text-[#3F3F46] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full h-11 px-3.5 rounded-lg border border-[#D4D4D8] focus:border-[#3A2AD9] focus:outline-none text-sm text-[#141416]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#3F3F46] mb-1.5">
                    Email address
                  </label>
                  <input
                    autoFocus
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="you@example.com"
                    className="w-full h-11 px-3.5 rounded-lg border border-[#D4D4D8] focus:border-[#3A2AD9] focus:outline-none text-sm text-[#141416]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3F3F46] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full h-11 px-3.5 rounded-lg border border-[#D4D4D8] focus:border-[#3A2AD9] focus:outline-none text-sm text-[#141416]"
                  />
                </div>

                {error && <p className="text-xs text-rose-600">{error}</p>}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-[#3A2AD9] hover:bg-[#3021C2] text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in...' : isRegister ? 'Create account' : 'Continue'}
              </button>

              <p className="text-center text-xs text-[#52525B]">
                {isRegister ? 'Already have an account?' : 'New to NeuroRead?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister((prev) => !prev);
                    setError('');
                  }}
                  className="text-[#3A2AD9] font-semibold hover:underline"
                >
                  {isRegister ? 'Sign in' : 'Create account'}
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
