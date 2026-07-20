type Props = {
  className?: string;
  withWordmark?: boolean;
};

/** Etalase snowflake/asterisk mark + optional wordmark. */
export default function EtalaseMark({ className, withWordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 sm:gap-2 ${className ?? ""}`}>
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-brand sm:h-5 sm:w-5 md:h-6 md:w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
      </svg>
      {withWordmark && (
        <span className="font-display text-base font-bold tracking-tight text-ink sm:text-lg md:text-xl">
          Etalase
        </span>
      )}
    </span>
  );
}
