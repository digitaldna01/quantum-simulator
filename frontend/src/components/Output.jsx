import "../App.css";
import "./Output.css";
import { useState } from "react";
import { Copy } from "lucide-react";

const Output = ({ statevector }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(statevector);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // 1.5초 후 복사 메시지 제거
  };

  return (
    <>
      <div className="col-span-1 p-4 border rounded-lg relative" id="dashboard-output">
        <div className="title">Output</div>
        {/* 복사 버튼 */}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 hover:scale-110 transition-transform bg-transparent border-none shadow-none cursor-pointer focus:outline-none focus:ring-0 active:outline-none active:ring-0"
          title="Copy to clipboard"
        >
          <Copy size={18} className="text-white" />
        </button>

        {/* 복사 확인 메시지 */}
        {copied && (
          <div className="absolute top-10 right-10 text-xs text-green-400 animate-pulse">
            Copied!
          </div>
        )}

        <div className="result h-5/6 rounded">
          <div className="result-text">{statevector}</div>
        </div>
      </div>
    </>
  );
};

export default Output;
