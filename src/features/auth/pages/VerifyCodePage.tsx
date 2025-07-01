import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { verifyCodeThunk, clearToken } from "../authSlice";

export const VerifyCodePage = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { email, secretImageUri, status, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  useEffect(() => {
  if (status === "verified") {
    dispatch(clearToken()); // chỉ xoá token, không reset state
    navigate("/login");
  }
}, [status, dispatch, navigate]);

  useEffect(() => {
    if (status === "failed") {
      const timer = setTimeout(() => {
        setCode(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6 || status === "loading") return;
    dispatch(verifyCodeThunk({ email, code: fullCode }));
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-black">Verify Two-Factor Authentication</h2>

        {secretImageUri && (
          <div className="flex justify-center">
            <img src={secretImageUri} alt="QR code" className="mb-4 w-48 rounded" loading="lazy" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => {
                  if (el) inputsRef.current[idx] = el;
                }}
                className="h-12 w-12 rounded border border-black text-center text-xl focus:ring-1 focus:ring-black"
              />
            ))}
          </div>

          {status === "loading" && <p className="text-center text-gray-500">Đang xác thực...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={code.join("").length < 6 || status === "loading"}
            className="w-full rounded bg-[#FFDE70] px-6 py-2 font-medium text-black hover:bg-black hover:text-white transition"
          >
            Verify Code
          </button>
        </form>

        <div className="flex justify-between text-sm text-[#B3B1B0]">
          <button onClick={() => window.history.back()} className="hover:text-[#FFDE70]">
            ← Back
          </button>
          <Link to="/" className="hover:text-[#FFDE70]">🏠 Home</Link>
        </div>
      </div>
    </section>
  );
};