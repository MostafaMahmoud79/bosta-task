export default function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "2px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{text}</p>
    </div>
  );
}