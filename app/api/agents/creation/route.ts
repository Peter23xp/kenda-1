import { buildAuthEmail } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import { agentFormSchema } from "@/app/agents/creation/schema";

export const runtime = "nodejs";

const PASSWORD_MIN = 5;
const PASSWORD_MAX = 10;
const PASSWORD_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
const DOCUMENTS_BUCKET = "agents-documents";
let bucketInitialized = false;

function generatePassword() {
  const length =
    Math.floor(Math.random() * (PASSWORD_MAX - PASSWORD_MIN + 1)) +
    PASSWORD_MIN;
  let password = "";
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * PASSWORD_ALPHABET.length);
    password += PASSWORD_ALPHABET[index];
  }
  return password;
}

async function ensureBucketExists() {
  if (bucketInitialized) {
    return;
  }

  const { data } = await supabaseAdmin.storage.getBucket(DOCUMENTS_BUCKET);
  if (!data) {
    const { error: bucketError } = await supabaseAdmin.storage.createBucket(
      DOCUMENTS_BUCKET,
      { public: false }
    );
    if (bucketError && !bucketError.message.includes("already exists")) {
      throw bucketError;
    }
  }
  bucketInitialized = true;
}

async function uploadDocument(
  file: File,
  loginIdentifier: string,
  label: string
) {
  await ensureBucketExists();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = file.name.split(".").pop() ?? "bin";
  const path = `${loginIdentifier}/${label}-${Date.now()}.${extension}`;

  const { data, error } = await supabaseAdmin.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return data.path;
}

async function generateLoginIdentifier() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("login_identifier")
    .eq("role", "agent")
    .order("login_identifier", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data?.login_identifier) {
    return "AGT-0001";
  }

  const [, numberPart] = data.login_identifier.split("-");
  const nextNumber = parseInt(numberPart, 10) + 1;
  return `AGT-${nextNumber.toString().padStart(4, "0")}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = agentFormSchema.safeParse({
      nom: formData.get("nom"),
      postNom: formData.get("postNom"),
      prenom: formData.get("prenom"),
      statutMatrimonial: formData.get("statutMatrimonial"),
      adresse: formData.get("adresse"),
      telephone: formData.get("telephone"),
      email: formData.get("email"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Champs invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      nom,
      postNom,
      prenom,
      statutMatrimonial,
      adresse,
      telephone,
      email,
    } = parsed.data;

    const carteElecteurFile = formData.get("carteElecteur");
    const carteAgentFile = formData.get("carteAgent");

    const loginIdentifier = await generateLoginIdentifier();
    const password = generatePassword();
    const authEmail = buildAuthEmail(loginIdentifier);

    let carteElecteurPath: string | null = null;
    if (carteElecteurFile instanceof File && carteElecteurFile.size > 0) {
      carteElecteurPath = await uploadDocument(
        carteElecteurFile,
        loginIdentifier,
        "carte-electeur"
      );
    }

    let carteAgentPath: string | null = null;
    if (carteAgentFile instanceof File && carteAgentFile.size > 0) {
      carteAgentPath = await uploadDocument(
        carteAgentFile,
        loginIdentifier,
        "carte-agent"
      );
    }

    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.admin.createUser({
      email: authEmail,
      email_confirm: true,
      password,
      user_metadata: {
        role: "agent",
        loginIdentifier,
      },
    });

    if (authError || !authData?.user) {
      throw authError || new Error("Création du compte impossible.");
    }

    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: authData.user.id,
      role: "agent",
      login_identifier: loginIdentifier,
      nom,
      post_nom: postNom,
      prenom,
      statut_matrimonial: statutMatrimonial,
      adresse,
      telephone,
      email: email || null,
      carte_electeur_url: carteElecteurPath,
      carte_agent_url: carteAgentPath,
    });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      loginIdentifier,
      password,
    });
  } catch (error) {
    console.error("[AGENT_CREATION]", error);
    return NextResponse.json(
      { error: "Une erreur inattendue est survenue." },
      { status: 500 }
    );
  }
}

