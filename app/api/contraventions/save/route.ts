import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialisation du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Utilisation de la clé de service pour les opérations côté serveur
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { agentId, usagerId, txHash } = await request.json();

    // Validation des données
    if (!agentId || !usagerId || !txHash) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérification du format des IDs
    if (!agentId.startsWith('AGT-') || !usagerId.startsWith('USR-')) {
      return NextResponse.json(
        { error: 'Format des IDs invalide' },
        { status: 400 }
      );
    }

    // 1. Récupérer l'UUID de l'agent (en vérifiant que c'est bien un agent)
    const { data: agentData, error: agentError } = await supabase
      .from('users')
      .select('id')
      .eq('login_identifier', agentId)
      .eq('role', 'agent') // Sécurité supplémentaire : on s'assure que c'est un agent
      .single();

    if (agentError || !agentData) {
      return NextResponse.json(
        { error: `Agent introuvable ou rôle invalide : ${agentId}` },
        { status: 404 }
      );
    }

    // 2. Récupérer l'UUID de l'usager (en vérifiant que c'est bien un usager)
    const { data: usagerData, error: usagerError } = await supabase
      .from('users')
      .select('id')
      .eq('login_identifier', usagerId)
      .eq('role', 'usager') // Sécurité supplémentaire : on s'assure que c'est un usager
      .single();

    if (usagerError || !usagerData) {
      return NextResponse.json(
        { error: `Usager introuvable ou rôle invalide : ${usagerId}` },
        { status: 404 }
      );
    }

    // 3. Insérer la contravention avec les VRAIS UUIDs récupérés
    const { data, error } = await supabase
      .from('contraventions')
      .insert([{
        agent_id: agentData.id, // L'UUID de l'agent
        usager_id: usagerData.id, // L'UUID de l'usager
        tx_hash: txHash,
        statut: 'active',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Contravention enregistrée avec succès'
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement de la contravention' },
      { status: 500 }
    );
  }
}
