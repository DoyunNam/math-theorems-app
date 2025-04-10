import { useState, useEffect, useRef } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./Login";
import { signOut } from "firebase/auth";

const config = {
  loader: { load: ["[tex]/ams"] },
  tex: {
    packages: { "[+]": ["ams"] },
  },
};

function App() {
  const [user] = useAuthState(auth); // 로그인된 사용자 정보
  const [theoremName, setTheoremName] = useState("");
  const [proofSeen, setProofSeen] = useState(false);
  const [theorems, setTheorems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const hasLoaded = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTheorems = theorems.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const saved = localStorage.getItem("theoremList");
    if (saved) {
      setTheorems(JSON.parse(saved));
    }
    hasLoaded.current = true;
  }, []);

  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem("theoremList", JSON.stringify(theorems));
    }
  }, [theorems]);

  const handleAdd = () => {
    if (theoremName.trim() === "") return;

    const newTheorem = {
      name: theoremName,
      proofSeen: proofSeen,
    };

    if (editIndex !== null) {
      const updated = [...theorems];
      updated[editIndex] = newTheorem;
      setTheorems(updated);
      setEditIndex(null);
    } else {
      setTheorems([...theorems, newTheorem]);
    }

    setTheoremName("");
    setProofSeen(false);
  };

  const handleDelete = (indexToDelete) => {
    const updated = theorems.filter((_, idx) => idx !== indexToDelete);
    setTheorems(updated);
  };

  const handleExport = () => {
    const data = localStorage.getItem("theoremList");
    if (!data) {
      alert("저장된 데이터가 없습니다.");
      return;
    }

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "theoremList.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MathJaxContext config={config}>
      <div className="flex flex-col items-center max-w-4xl mx-auto px-4 py-8 space-y-6">
        {user && (
          <div className="w-full flex justify-end items-center space-x-4 mb-2 text-sm text-gray-600">
            <span>👋 {user.displayName}님 환영합니다!</span>
            <button
              onClick={() => signOut(auth)}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              로그아웃
            </button>
          </div>
        )}

        <Login />
        <h1 className="text-3xl font-bold text-blue-700">
          📚 수학 정리 분류 앱
        </h1>
        <div className="w-full flex justify-between items-center">
          {user && (
            <p className="text-sm text-gray-700">
              👋 {user.displayName}님 환영합니다!
            </p>
          )}
        </div>
        <p className="text-gray-700 text-lg">
          정리 이름을 입력하고, 증명을 본 적이 있는지 표시해보세요.
        </p>
        <input
          type="text"
          placeholder="정리 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md"
        />
        {/* 🔽 JSON 내보내기 / 가져오기 버튼들 */}
        <div className="w-full max-w-3xl flex justify-end gap-2">
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            📤 JSON 내보내기
          </button>

          <label
            htmlFor="file-upload"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
          >
            📥 JSON 가져오기
          </label>
          <input
            id="file-upload"
            type="file"
            accept="application/json"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const json = JSON.parse(event.target.result);
                  if (Array.isArray(json)) {
                    setTheorems(json);
                    localStorage.setItem("theoremList", JSON.stringify(json));
                    alert("✅ JSON 데이터를 성공적으로 불러왔습니다!");
                  } else {
                    alert("⚠️ JSON 형식이 올바르지 않습니다.");
                  }
                } catch (err) {
                  alert("❌ JSON 파일을 읽는 중 오류가 발생했습니다.");
                }
              };
              reader.readAsText(file);
            }}
            className="hidden"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-6 w-full max-w-3xl">
          <input
            type="text"
            placeholder="정리 이름 입력"
            value={theoremName}
            onChange={(e) => setTheoremName(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={proofSeen}
              onChange={(e) => setProofSeen(e.target.checked)}
              className="w-4 h-4"
            />
            증명 본 적 있음
          </label>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {editIndex !== null ? "수정" : "추가"}
          </button>
        </div>
        <table className="w-full border border-gray-300 text-left table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-[500px] p-2 text-center">정리 이름</th>
              <th className="w-[80px] p-2 text-center">증명</th>
              <th className="w-[80px] p-2 text-center">삭제</th>
              <th className="w-[80px] p-2 text-center">수정</th>
            </tr>
          </thead>
          <tbody>
            {filteredTheorems.map((t, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">
                  <MathJax dynamic>{t.name}</MathJax>
                </td>
                <td className="p-2 text-center">{t.proofSeen ? "✅" : "❌"}</td>
                <td className="p-2 text-center">
                  <button onClick={() => handleDelete(index)}>🗑️</button>
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => {
                      setTheoremName(t.name);
                      setProofSeen(t.proofSeen);
                      setEditIndex(index);
                    }}
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MathJaxContext>
  );
}

export default App;
