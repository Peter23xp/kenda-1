import { useState } from 'react';
import { INFRACTIONS, Infraction } from '@/data/infractions';

interface ContraventionData {
  agentId: string;
  plaque: string;
  usager: string;
  infractionId: string;
  montant: number;
}

interface Props {
  onSubmit: (data: ContraventionData) => void;
}

export default function ContraventionForm({ onSubmit }: Props) {
  const [selectedInfraction, setSelectedInfraction] = useState<Infraction | null>(null);
  
  const [formData, setFormData] = useState<ContraventionData>({
    agentId: 'AGT-',
    plaque: '',
    usager: 'USR-',
    infractionId: '',
    montant: 0,
  });

  const handleInfractionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const infractionId = e.target.value;
    const infraction = INFRACTIONS.find(i => i.id.toString() === infractionId);
    
    if (infraction) {
      setSelectedInfraction(infraction);
      setFormData({
        ...formData,
        infractionId: infraction.id.toString(),
        montant: infraction.tarif_usd
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Gestion spéciale pour les champs avec préfixe
    if (name === 'agentId') {
      // Ne garder que les chiffres après le préfixe
      const numbersOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: `AGT-${numbersOnly}` });
    } else if (name === 'usager') {
      // Ne garder que les chiffres après le préfixe
      const numbersOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: `USR-${numbersOnly}` });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Vérifier que les champs avec préfixe contiennent bien des chiffres
    if (!/^AGT-\d+$/.test(formData.agentId)) {
      alert("Veuillez entrer un numéro d'agent valide");
      return;
    }
    if (!/^USR-\d+$/.test(formData.usager)) {
      alert("Veuillez entrer un numéro d'usager valide");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-[#F0B90B]">
          Formulaire
        </p>
        <h1 className="text-2xl font-semibold text-white">
          Création d'une contravention
        </h1>
        <p className="text-gray-400 text-sm">
          Remplissez les détails de l'infraction. Tous les champs sont obligatoires.
        </p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="space-y-5 bg-[#0A0A0A] p-6 rounded-2xl border border-[#1f1f1f]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="agentId" className="block text-sm font-medium text-[#F0B90B] mb-1.5">
              Agent ID
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">AGT-</span>
              <input
                type="text"
                id="agentId"
                name="agentId"
                value={formData.agentId}
                onChange={handleChange}
                required
                className="w-full bg-[#0A0A0A] border border-[#1f1f1f] text-white text-sm rounded-lg focus:ring-2 focus:ring-[#F0B90B]/50 focus:border-[#F0B90B] block pl-12 pr-3 py-2.5 transition-all duration-200"
                placeholder="123456"
              />
            </div>
          </div>

          <div>
            <label htmlFor="plaque" className="block text-sm font-medium text-[#F0B90B] mb-1.5">
              Plaque d'immatriculation
            </label>
            <input
              type="text"
              id="plaque"
              name="plaque"
              value={formData.plaque}
              onChange={handleChange}
              required
              className="bg-[#0A0A0A] border border-[#1f1f1f] text-white text-sm rounded-lg focus:ring-2 focus:ring-[#F0B90B]/50 focus:border-[#F0B90B] block w-full p-2.5 transition-all duration-200"
              placeholder="AB-123-CD"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="usager" className="block text-sm font-medium text-[#F0B90B] mb-1.5">
              Identifiant Usager
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">USR-</span>
              <input
                type="text"
                id="usager"
                name="usager"
                value={formData.usager}
                onChange={handleChange}
                required
                className="w-full bg-[#0A0A0A] border border-[#1f1f1f] text-white text-sm rounded-lg focus:ring-2 focus:ring-[#F0B90B]/50 focus:border-[#F0B90B] block pl-12 pr-3 py-2.5 transition-all duration-200"
                placeholder="789012"
              />
            </div>
          </div>
          

          <div>
            <label htmlFor="montant" className="block text-sm font-medium text-[#F0B90B] mb-1.5">
              Montant de l'amende (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="text"
                id="montant"
                name="montant"
                value={formData.montant ? formData.montant.toFixed(2) : ''}
                readOnly
                className="w-full bg-[#0A0A0A] border border-[#1f1f1f] text-white text-sm rounded-lg block pl-8 pr-3 py-2.5 bg-opacity-50 cursor-not-allowed"
                placeholder="Sélectionnez d'abord une infraction"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="infraction" className="block text-sm font-medium text-[#F0B90B] mb-1.5">
            Sélectionnez l'infraction
          </label>
          <select
            id="infraction"
            name="infraction"
            value={formData.infractionId}
            onChange={handleInfractionChange}
            required
            className="w-full bg-[#0A0A0A] border border-[#1f1f1f] text-white text-sm rounded-lg focus:ring-2 focus:ring-[#F0B90B]/50 focus:border-[#F0B90B] p-2.5 transition-all duration-200"
          >
            <option value="">Sélectionnez une infraction</option>
            {INFRACTIONS.map((infraction) => (
              <option key={infraction.id} value={infraction.id}>
                #{infraction.id} : {infraction.nom} - {infraction.tarif_usd} USD
              </option>
            ))}
          </select>
          {selectedInfraction && (
            <div className="mt-2 p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
              <p className="text-sm text-gray-300">
                <span className="font-medium text-[#F0B90B]">Description :</span> {selectedInfraction.nom}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                <span className="font-medium text-[#F0B90B]">Référence :</span> #{selectedInfraction.id}
              </p>
            </div>
          )}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Créer la contravention
          </button>
        </div>
      </form>
    </div>
  );
}
