export type ClassValue = string | number | null | false | undefined;

/**
 * Join truthy class names. Dependency-free `cn` placeholder until shadcn/ui
 * is initialized (then swap to clsx + tailwind-merge).
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
