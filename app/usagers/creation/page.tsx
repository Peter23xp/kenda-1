"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  ChangeEvent,
  InputHTMLAttributes,
  forwardRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

const formSchema = z.object({
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
  email: z.string().email("Veuillez renseigner une adresse e-mail valide."),
});

type FormValues = z.infer<typeof formSchema>;

export default function UsagerCreationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [modalData, setModalData] = useState<{
    loginIdentifier: string;
    password: string;
  } | null>(null);
  const [documents, setDocuments] = useState<{
    carteIdentite: File | null;
    permisConduire: File | null;
  }>({
    carteIdentite: null,
    permisConduire: null,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      postNom: "",
      prenom: "",
      statutMatrimonial: "",
      adresse: "",
      telephone: "",
      email: "",
    },
  });

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    key: "carteIdentite" | "permisConduire"
  ) => {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > MAX_FILE_SIZE) {
      setServerError("Chaque document doit être inférieur à 5 Mo.");
      event.target.value = "";
      return;
    }
    setDocuments((prev) => ({ ...prev, [key]: file }));
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* noop */
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (documents.carteIdentite) {
        payload.append("carteIdentite", documents.carteIdentite);
      }
      if (documents.permisConduire) {
        payload.append("permisConduire", documents.permisConduire);
      }

      const response = await fetch("/api/usagers/creation", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || "Impossible de créer le compte.");
      }

      const data = await response.json();
      setModalData({
        loginIdentifier: data.loginIdentifier,
        password: data.password,
      });
      form.reset();
      setDocuments({ carteIdentite: null, permisConduire: null });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white px-4 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm uppercase tracking-[0.25em] text-[#F0B90B]">
          Usagers · Onboarding
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold mt-3">
          Créez votre compte Kenda
        </h1>
        <p className="text-gray-300 mt-4 max-w-3xl">
          Renseignez vos informations personnelles pour recevoir, en quelques
          secondes, un identifiant et un mot de passe générés automatiquement.
          Ces accès vous permettront de consulter et payer vos contraventions en
          toute transparence.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="p-6 md:p-8 border border-[#1f1f1f] rounded-2xl bg-[#0C0C0C]">
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <section>
                <h2 className="text-xl font-semibold text-white">
                  Informations personnelles
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Nom"
                    placeholder="Ex. Kabasele"
                    error={form.formState.errors.nom?.message}
                    {...form.register("nom")}
                  />
                  <Field
                    label="Post-nom"
                    placeholder="Ex. Mbuyi"
                    error={form.formState.errors.postNom?.message}
                    {...form.register("postNom")}
                  />
                  <Field
                    label="Prénom"
                    placeholder="Ex. Aïcha"
                    error={form.formState.errors.prenom?.message}
                    {...form.register("prenom")}
                  />
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">
                      Statut matrimonial
                    </label>
                    <select
                      className="bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/50"
                      {...form.register("statutMatrimonial")}
                    >
                      <option value="">Sélectionnez…</option>
                      <option value="Celibataire">Célibataire</option>
                      <option value="Marie(e)">Marié(e)</option>
                      <option value="Divorce(e)">Divorcé(e)</option>
                      <option value="Veuf(ve)">Veuf / Veuve</option>
                    </select>
                    {form.formState.errors.statutMatrimonial?.message && (
                      <p className="text-sm text-red-400 mt-1">
                        {form.formState.errors.statutMatrimonial.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white">
                  Coordonnées
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Adresse complète"
                    placeholder="Quartier, Avenue, Commune…"
                    error={form.formState.errors.adresse?.message}
                    {...form.register("adresse")}
                  />
                  <Field
                    label="Numéro de téléphone"
                    placeholder="+243 000 000 000"
                    error={form.formState.errors.telephone?.message}
                    {...form.register("telephone")}
                  />
                  <Field
                    label="Adresse e-mail"
                    type="email"
                    placeholder="exemple@kenda.cd"
                    error={form.formState.errors.email?.message}
                    {...form.register("email")}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white">
                  Documents (optionnel)
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                  Formats acceptés : PDF, PNG, JPG. Taille maximale : 5 Mo par
                  document.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <UploadField
                    label="Carte d’identité"
                    file={documents.carteIdentite}
                    onChange={(event) => handleFileChange(event, "carteIdentite")}
                  />
                  <UploadField
                    label="Permis de conduire"
                    file={documents.permisConduire}
                    onChange={(event) =>
                      handleFileChange(event, "permisConduire")
                    }
                  />
                </div>
              </section>

              {serverError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {serverError}
                </div>
              )}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
                <p className="text-sm text-gray-400">
                  Les identifiants générés ne seront affichés qu’une seule fois.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#F0B90B] text-black font-semibold px-6 py-3 rounded-full transition hover:bg-[#e0b010] disabled:opacity-60"
                >
                  {isSubmitting ? "Création en cours..." : "Créer mon compte"}
                </button>
              </div>
            </form>
          </div>

          <aside className="p-6 border border-[#1f1f1f] rounded-2xl bg-[#0C0C0C] space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#F0B90B]">
                Rappel
              </p>
              <p className="text-gray-300 mt-3">
                Après validation, notez soigneusement vos identifiants. Vous en
                aurez besoin pour vous connecter à l’espace usager. En cas de
                perte, contactez l’administration Kenda.
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#F0B90B]">
                Besoin d’aide ?
              </p>
              <p className="text-gray-300 mt-3">
                Écrivez-nous sur{" "}
                <a
                  href="mailto:support@kenda.cd"
                  className="text-[#F0B90B] underline underline-offset-4"
                >
                  support@kenda.cd
                </a>{" "}
                ou{" "}
                <Link
                  href="/"
                  className="text-[#F0B90B] underline underline-offset-4"
                >
                  retournez à l’accueil
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </div>

      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#2f2f2f] bg-[#050505] p-8 shadow-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[#F0B90B]">
              Identifiants générés
            </p>
            <h3 className="font-heading text-2xl mt-3">
              Sauvegardez ces informations
            </h3>
            <p className="text-gray-400 mt-2">
              Ces accès ne seront affichés qu’une seule fois. Conservez-les dans
              un endroit sécurisé.
            </p>

            <div className="mt-6 space-y-4">
              <CredentialRow
                label="Identifiant"
                value={modalData.loginIdentifier}
                onCopy={() => copyToClipboard(modalData.loginIdentifier)}
              />
              <CredentialRow
                label="Mot de passe"
                value={modalData.password}
                onCopy={() => copyToClipboard(modalData.password)}
              />
            </div>

            <button
              className="mt-8 w-full bg-[#F0B90B] text-black font-semibold py-3 rounded-full hover:bg-[#e0b010]"
              onClick={() => setModalData(null)}
            >
              J’ai bien noté mes accès
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, ...props }, ref) => (
    <div className="flex flex-col">
      <label className="text-sm text-gray-300 mb-1">{label}</label>
      <input
        ref={ref}
        className="bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/50"
        {...props}
      />
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  )
);

Field.displayName = "Field";

type UploadFieldProps = {
  label: string;
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const UploadField = ({ label, file, onChange }: UploadFieldProps) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-300 mb-1">{label}</label>
    <label className="flex flex-col items-center justify-center border border-dashed border-[#3a3a3a] rounded-xl px-4 py-6 text-center cursor-pointer hover:border-[#F0B90B]/60 hover:bg-[#111111] transition">
      <span className="text-sm text-gray-400">
        {file ? file.name : "Cliquez pour téléverser"}
      </span>
      <input
        type="file"
        accept=".pdf,image/*"
        className="hidden"
        onChange={onChange}
      />
    </label>
  </div>
);

type CredentialRowProps = {
  label: string;
  value: string;
  onCopy: () => void;
};

const CredentialRow = ({ label, value, onCopy }: CredentialRowProps) => (
  <div className="flex items-center justify-between rounded-xl bg-[#111111] px-4 py-3 border border-[#2a2a2a]">
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
        {label}
      </p>
      <p className="text-lg font-mono text-white mt-1">{value}</p>
    </div>
    <button
      type="button"
      onClick={onCopy}
      className="text-[#F0B90B] text-sm font-semibold"
    >
      Copier
    </button>
  </div>
);

