import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies."
  );
}

const loginDomain = process.env.NEXT_PUBLIC_LOGIN_EMAIL_DOMAIN || "kenda.local";
const adminIdentifier = process.env.ADMIN_IDENTIFIER || "ADM-0001";
const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
const adminNom = process.env.ADMIN_NOM || "Administrateur";
const adminPostNom = process.env.ADMIN_POST_NOM || "Principal";
const adminPrenom = process.env.ADMIN_PRENOM || "Kenda";
const adminStatut = process.env.ADMIN_STATUT_MATRIMONIAL || "N/A";
const adminAdresse = process.env.ADMIN_ADRESSE || "Quartier Central";
const adminTelephone = process.env.ADMIN_TELEPHONE || "+0000000000";
const adminContactEmail = process.env.ADMIN_CONTACT_EMAIL || null;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const buildAuthEmail = (identifier) =>
  `${identifier.toLowerCase()}@${loginDomain}`;

async function main() {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("login_identifier", adminIdentifier)
    .maybeSingle();

  if (existing) {
    console.log(
      `Un administrateur avec l'identifiant ${adminIdentifier} existe déjà.`
    );
    return;
  }

  const authEmail = buildAuthEmail(adminIdentifier);

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: authEmail,
      email_confirm: true,
      password: adminPassword,
      user_metadata: {
        role: "admin",
        loginIdentifier: adminIdentifier,
      },
    });

  if (authError || !authData?.user) {
    throw authError || new Error("Impossible de créer l'utilisateur admin.");
  }

  const { error: insertError } = await supabase.from("users").insert({
    id: authData.user.id,
    role: "admin",
    login_identifier: adminIdentifier,
    nom: adminNom,
    post_nom: adminPostNom,
    prenom: adminPrenom,
    statut_matrimonial: adminStatut,
    adresse: adminAdresse,
    telephone: adminTelephone,
    email: adminContactEmail,
  });

  if (insertError) {
    throw insertError;
  }

  console.log("Compte administrateur créé avec succès.");
  console.log(
    `Identifiant: ${adminIdentifier} | Email technique: ${authEmail} | Mot de passe: ${adminPassword}`
  );
}

main().catch((error) => {
  console.error("Erreur lors de la création de l'administrateur :", error);
  process.exit(1);
});

