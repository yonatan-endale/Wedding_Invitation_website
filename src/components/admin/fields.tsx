import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LocalizedText } from "@/lib/localized";
import { cn } from "@/lib/utils";
import type { FieldErrors } from "@/lib/validation/admin";

export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <FieldError message={error} /> : hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** Side-by-side English and Amharic inputs posting `<name>.en` and `<name>.am`. */
export function LocalizedField({
  name,
  label,
  defaultValue,
  errors,
  multiline = false,
  rows = 4,
  required = false,
  hint,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: LocalizedText | null;
  errors?: FieldErrors;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  hint?: ReactNode;
  placeholder?: { en?: string; am?: string };
}) {
  const enError = errors?.[`${name}.en`];
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        {(["en", "am"] as const).map((lang) => {
          const id = `${name}-${lang}`;
          const props = {
            id,
            name: `${name}.${lang}`,
            lang,
            defaultValue: defaultValue?.[lang] ?? "",
            placeholder: placeholder?.[lang],
            "aria-invalid": lang === "en" && enError ? true : undefined,
          };
          return (
            <div key={lang} className="grid gap-1.5">
              <Label htmlFor={id} className="text-xs font-normal text-muted-foreground">
                {lang === "en" ? (required ? "English" : "English") : "Amharic (optional)"}
              </Label>
              {multiline ? <Textarea rows={rows} {...props} /> : <Input {...props} />}
            </div>
          );
        })}
      </div>
      {enError ? <FieldError message={enError} /> : hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </fieldset>
  );
}

export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 border-b pb-8 last:border-b-0 last:pb-0 md:grid-cols-[14rem_1fr] md:gap-10">
      <div>
        <h2 className="font-medium">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="grid gap-6">{children}</div>
    </section>
  );
}

export function SubmitButton({ pending, children, ...props }: ComponentProps<typeof Button> & { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
      {children}
    </Button>
  );
}
