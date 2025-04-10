// src/Login.js
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`환영합니다, ${user.displayName}님!`);
      // 여기에 로그인 후 동작 추가 가능
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
    >
      🔐 Google로 로그인
    </button>
  );
}

export default Login;
