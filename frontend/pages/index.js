import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [aadhaar, setAadhaar] = useState("");

  const verifyVoter = async () => {
    const res = await fetch("http://localhost:5000/verify-voter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaar }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("You are not registered to vote");
      return;
    }

    localStorage.setItem("voterHash", data.voterHash);
    router.push("/dashboard");
  };

  return (
    <div style={styles.container}>
      <h1>SecureVote</h1>

      <input
        style={styles.input}
        placeholder="Enter Aadhaar Number"
        maxLength={12}
        value={aadhaar}
        onChange={(e) => setAadhaar(e.target.value)}
      />

      <button style={styles.button} onClick={verifyVoter}>
        Verify & Continue
      </button>

      <p style={styles.note}>
        Aadhaar is hashed instantly. No Aadhaar is stored.
      </p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "#021c26",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    padding: "12px",
    width: "260px",
    marginBottom: "15px",
  },
  button: {
    padding: "12px 20px",
    background: "#22c55e",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  note: {
    marginTop: "15px",
    fontSize: "12px",
    opacity: 0.7,
  },
};
