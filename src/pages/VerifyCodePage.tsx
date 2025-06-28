import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export const VerifyCodePage = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

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
    console.log("Verification code:", fullCode);
    // Xử lý mã ở đây
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-black">
          Enter Verification Code
        </h2>
        <p className="text-center text-sm text-[#B3B1B0]">
          We’ve sent a 6-digit code to your email. Please enter it below to verify your account.
        </p>

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
                className="w-12 h-12 rounded border border-black text-center text-xl outline-none focus:ring-1 focus:ring-black"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded bg-[#FFDE70] px-6 py-2 font-medium text-black transition hover:bg-black hover:text-white"
          >
            Confirm
          </button>
        </form>

        <div className="text-center text-sm text-[#B3B1B0]">
          Didn't receive the code?{" "}
          <button className="font-medium text-black hover:text-[#FFDE70]">
            Resend
          </button>
        </div>

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