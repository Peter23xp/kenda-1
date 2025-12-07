"use client";

import { useRouter } from 'next/navigation';
import ContraventionForm from '@/components/ContraventionForm';

export default function AddContraventionPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    // Ici, vous pouvez appeler une API pour créer la contravention sur la blockchain
    console.log('Données soumises :', data);

    // Exemple : redirection après soumission
    router.push('/agents/espace');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Créer une contravention</h1>
      <ContraventionForm onSubmit={handleSubmit} />
    </div>
  );
}
