import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();

        // Créer un client Supabase côté serveur avec les cookies
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    },
                },
            }
        );

        // Vérifier l'authentification
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Récupérer les contraventions de l'utilisateur
        const { data: contraventions, error } = await supabase
            .from('contraventions')
            .select('id, agent_id, usager_id, tx_hash, statut, created_at')
            .eq('usager_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        if (!contraventions || contraventions.length === 0) {
            return NextResponse.json({ contraventions: [] });
        }

        // Récupérer les IDs uniques des agents et usagers
        const agentIds = [...new Set(contraventions.map(c => c.agent_id))];
        const usagerIds = [...new Set(contraventions.map(c => c.usager_id))];

        // Utiliser supabaseAdmin pour récupérer les agents (contourne les RLS)
        const { data: agents } = await supabaseAdmin
            .from('users')
            .select('id, login_identifier')
            .in('id', agentIds);

        // Utiliser supabaseAdmin pour les usagers aussi (cohérence)
        const { data: usagers } = await supabaseAdmin
            .from('users')
            .select('id, login_identifier')
            .in('id', usagerIds);

        // Créer des maps pour un accès rapide
        const agentMap = new Map(agents?.map(a => [a.id, a.login_identifier]) || []);
        const usagerMap = new Map(usagers?.map(u => [u.id, u.login_identifier]) || []);

        // Formater les données pour le frontend
        const formattedData = contraventions.map((c) => ({
            id: c.id,
            agentId: agentMap.get(c.agent_id) || 'N/A',
            usagerId: usagerMap.get(c.usager_id) || 'N/A',
            txHash: c.tx_hash,
            createdAt: new Date(c.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            statut: c.statut === 'payed' ? 'payed' : 'active',
        }));

        return NextResponse.json({ contraventions: formattedData });

    } catch (error) {
        console.error('Erreur serveur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des contraventions' },
            { status: 500 }
        );
    }
}
