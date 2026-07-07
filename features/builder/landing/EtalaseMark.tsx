type Props = {
  className?: string;
  withWordmark?: boolean;
};

/** Etalase snowflake/asterisk mark + optional wordmark. */
export default function EtalaseMark({ className, withWordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-brand"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
      </svg>
      {withWordmark && (
        <span className="font-display text-xl font-bold tracking-tight text-ink">
          Etalase
        </span>
      )}
    </span>
  );
}
