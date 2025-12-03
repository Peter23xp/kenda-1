import { z } from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

export const agentFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  postNom: z.string().min(2, "Le post-nom doit contenir au moins 2 caractères."),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  statutMatrimonial: z
    .string()
    .min(2, "Veuillez sélectionner un statut matrimonial."),
  adresse: z.string().min(5, "L’adresse doit contenir au moins 5 caractères."),
  telephone: z
    .string()
    .min(6, "Le numéro de téléphone doit contenir au moins 6 chiffres."),
  email: z
    .string()
    .email("Veuillez renseigner un email valide.")
    .optional()
    .or(z.literal("")),
});

