"use client";

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/actions/admin";

export const initialActionState: ActionState = { ok: false, message: null, fieldErrors: {}, savedAt: 0 };

type FormAction = (previous: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Runs a server action from a form without React's automatic form reset, so a
 * failed save keeps what the admin typed. Shows a toast for every result.
 */
export function useAdminForm(action: FormAction, options: { onSuccess?: () => void } = {}) {
  const [state, dispatch, pending] = useActionState(action, initialActionState);
  const handled = useRef(0);
  const onSuccess = useRef(options.onSuccess);
  onSuccess.current = options.onSuccess;

  useEffect(() => {
    if (!state.savedAt || state.savedAt === handled.current) return;
    handled.current = state.savedAt;
    if (state.ok) {
      if (state.message) toast.success(state.message);
      onSuccess.current?.();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }

  return { state, pending, onSubmit, errors: state.fieldErrors };
}

/** Toasts the result of a one-off action call (publish, delete, reorder). */
export function reportResult(result: ActionState) {
  if (result.ok) {
    if (result.message) toast.success(result.message);
  } else if (result.message) {
    toast.error(result.message);
  }
}
