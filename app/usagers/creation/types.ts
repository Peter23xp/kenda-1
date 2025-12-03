import type { ChangeEvent, InputHTMLAttributes } from "react";
import type { z } from "zod";
import { usagerFormSchema } from "./schema";

export type UsagerFormValues = z.infer<typeof usagerFormSchema>;

export type DocumentKeys = "carteIdentite" | "permisConduire";

export type DocumentsState = Record<DocumentKeys, File | null>;

export type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export type UploadFieldProps = {
  label: string;
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type CredentialRowProps = {
  label: string;
  value: string;
  onCopy: () => void;
};

