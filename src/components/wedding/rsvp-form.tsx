"use client";

import { useTranslations } from "next-intl";
import { startTransition, useActionState, useId, useState, type FormEvent } from "react";
import { submitRsvp, type RsvpFormState } from "@/actions/rsvp";
import { cn } from "@/lib/utils";
import { buttonOutline, buttonPrimary } from "./primitives";

const initialState: RsvpFormState = { status: "idle" };

const inputClass =
  "block w-full rounded-[3px] border border-rule bg-paper px-4 py-3 text-lg text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-thread-1 aria-invalid:border-thread-3";

export function RsvpForm({ slug }: { slug: string }) {
  const t = useTranslations("rsvp");
  const id = useId();
  const [state, formAction, pending] = useActionState(submitRsvp.bind(null, slug), initialState);
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [formKey, setFormKey] = useState(0);

  // Submit manually so React doesn't reset the form: a failed RSVP keeps every answer, including the radio choice.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  if (state.status === "success" && formKey === state.submissionId) {
    return (
      <div role="status" className="mt-10 border border-rule bg-paper px-6 py-10 text-center">
        <p className="font-display text-[clamp(1.5rem,4vw,2rem)] leading-snug">
          {state.attending ? t("thanksYes", { name: state.name }) : t("thanksNo", { name: state.name })}
        </p>
        <button
          type="button"
          className={cn(buttonOutline, "mt-8")}
          onClick={() => {
            setFormKey((k) => k + 1);
            setAttending(null);
          }}
        >
          {t("another")}
        </button>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : [];
  const values = state.status === "error" ? state.values : {};
  const hasError = (field: string) => (errors as string[]).includes(field);
  const choice = attending ?? (values.attending === "yes" || values.attending === "no" ? values.attending : null);

  const errorText = (field: string) =>
    hasError(field) ? (
      <p id={`${id}-${field}-error`} className="mt-2 text-base text-thread-3">
        {t(`errors.${field}` as "errors.name")}
      </p>
    ) : null;

  return (
    <form key={formKey} action={formAction} onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
      <input type="hidden" name="submissionId" value={formKey} />
      {/* Hidden from people; bots that fill it are ignored. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor={`${id}-name`} className="mb-2 block text-base">
          {t("name")}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          required
          defaultValue={values.name}
          aria-invalid={hasError("name") || undefined}
          aria-describedby={hasError("name") ? `${id}-name-error` : undefined}
          className={inputClass}
        />
        {errorText("name")}
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className="mb-2 block text-base">
          {t("phone")}
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="+251 9…"
          defaultValue={values.phone}
          aria-invalid={hasError("phone") || undefined}
          aria-describedby={hasError("phone") ? `${id}-phone-error` : undefined}
          className={inputClass}
        />
        {errorText("phone")}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="mb-2 block text-base">
          {t("email")}
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={values.email}
          aria-invalid={hasError("email") || undefined}
          aria-describedby={hasError("email") ? `${id}-email-error` : undefined}
          className={inputClass}
        />
        {errorText("email")}
      </div>

      <fieldset aria-describedby={hasError("attending") ? `${id}-attending-error` : undefined}>
        <legend className="mb-3 text-base">{t("attendance")}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["yes", "no"] as const).map((option) => (
            <label
              key={option}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[3px] border px-4 py-4 text-lg transition-colors",
                choice === option ? "border-thread-1 bg-thread-1/[0.07]" : "border-rule bg-paper hover:border-ink/40",
              )}
            >
              <input
                type="radio"
                name="attending"
                value={option}
                required
                checked={choice === option}
                onChange={() => setAttending(option)}
                className="size-5 accent-[var(--w-thread-1)]"
              />
              {option === "yes" ? t("yes") : t("no")}
            </label>
          ))}
        </div>
        {errorText("attending")}
      </fieldset>

      {choice !== "no" ? (
        <div>
          <label htmlFor={`${id}-guests`} className="mb-2 block text-base">
            {t("guestCount")}
          </label>
          <select
            id={`${id}-guests`}
            name="guestCount"
            defaultValue={values.guestCount ?? "1"}
            aria-invalid={hasError("guestCount") || undefined}
            className={cn(inputClass, "tabular-nums")}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {errorText("guestCount")}
        </div>
      ) : null}

      <div>
        <label htmlFor={`${id}-message`} className="mb-2 block text-base">
          {t("message")}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          maxLength={500}
          defaultValue={values.message}
          aria-invalid={hasError("message") || undefined}
          className={cn(inputClass, "resize-y")}
        />
        {errorText("message")}
      </div>

      {state.status === "error" && state.formError ? (
        <p role="alert" className="text-base text-thread-3">
          {t(`errors.${state.formError}`)}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={cn(buttonPrimary, "w-full text-lg")}>
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
