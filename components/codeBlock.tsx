"use client";
import { Snippet } from "@heroui/react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ codeSamples }: { codeSamples: Record<string, string> }) {
  const languages = Object.keys(codeSamples || {});
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  return (
    <div className="w-full rounded-xl border border-gray-700 bg-gray-900 shadow-lg overflow-hidden">
      <div className="flex space-x-2 border-b border-gray-700 bg-gray-800 px-3 py-2 text-sm">
        {languages.length > 1 ? (
          languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1 rounded-md capitalize transition ${
                selectedLang === lang
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              } cursor-pointer`}
            >
              {lang}
            </button>
          ))
        ) : (
          <span />
        )}
        <div className="ml-auto">
          <Snippet
            title=""
            symbol=""
            className="block p-0 px-1"
            onCopy={() =>
              navigator.clipboard.writeText(codeSamples[selectedLang])
            }
          />
        </div>
      </div>

      {/* Code Block */}
      <SyntaxHighlighter
        language={selectedLang.toLowerCase()}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: "0 0 0.75rem 0.75rem",
          padding: "1rem",
          background: "#1E1E1E",
          fontSize: "1rem",
        }}
        codeTagProps={{ className: "text-md" }}
      >
        {codeSamples[selectedLang]}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
