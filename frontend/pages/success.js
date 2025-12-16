import { useRouter } from "next/router";

export default function Confirm() {
  const router = useRouter();
  const { candidate } = router.query;

  const confirmVote = () => {
    // later → call backend + blockchain
    router.push("/success");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Confirm Your Vote</h1>

      <p style={styles.text}>
        You have selected:
      </p>

      <div style={styles.card}>{candidate}</div>

      <button style={styles.button} onClick={confirmVote}>
        Confirm & Submit
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#021c26",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "80px",
  },
  title: {
    marginBottom: "30px",
    fontSize: "26px",
  },
  text: {
    marginBottom: "10px",
    opacity: 0.8,
  },
  card: {
    padding: "15px 40px",
    background: "#0b3c49",
    borderRadius: "8px",
    marginBottom: "30px",
    fontSize: "18px",
  },
  button: {
    padding: "12px 30px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
