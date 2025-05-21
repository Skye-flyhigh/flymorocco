export default function FormButton({ status }: { status: boolean }) {
  return (
    <button
      type="submit"
      className="btn btn-primary w-fit self-center"
      disabled={status}
    >
      {status ? "Submitting..." : "Generate documents"}
    </button>
  );
}
