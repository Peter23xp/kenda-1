import type { ChangeEvent, InputHTMLAttributes } from "react";
import type { z } from "zod";
import { agentFormSchema } from "./schema";

export type AgentFormValues = z.infer<typeof agentFormSchema>;

export type AgentDocumentKeys = "carteElecteur" | "carteAgent";

export type AgentDocumentsState = Record<AgentDocumentKeys, File | null>;

export type AgentFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export type AgentUploadFieldProps = {
  label: string;
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type AgentCredentialRowProps = {
  label: string;
  value: string;
  onCopy: () => void;
};

