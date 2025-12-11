import {
  BlockfrostProvider,
  MeshWallet,
  MeshTxBuilder
} from '@meshsdk/core';

export interface BlockchainMetadata {
  agent: string;
  usager: string;
  plaque: string;
  infraction: string;
  montant: number;
  timestamp: string;
}

export async function sendToBlockchain(metadata: BlockchainMetadata): Promise<string> {
  try {
    const NETWORK_ID = 0;
    const BLOCKFROST_API_KEY = "preprod6eb6sa6Y14nBKQqffIGOCkDCRACxRRHd"; //aussi
    console.log(BLOCKFROST_API_KEY);
    // Configuration du fournisseur Blockfrost
    const provider = new BlockfrostProvider(BLOCKFROST_API_KEY, 0);

    // Configuration du wallet avec la phrase mnémonique
    const wallet = new MeshWallet({
      networkId: NETWORK_ID,
      fetcher: provider,
      submitter: provider,
      key: {
        type: 'mnemonic',
        words: ["whale", "ball", "witness", "loop", "manage", "apart", "fog", "love", "summer", "jaguar", "first", "tragic", "daring", "infant", "opera", "game", "describe", "pelican", "once", "omit", "cross", "grunt", "spray", "body"],// A stocker dans le fichier .env, apres les tests
      }
    });

    // Récupération des UTxOs du wallet
    const utxos = await wallet.getUtxos();
    console.log("UTxOs du wallet:", JSON.stringify(utxos, null, 2));

    const changeAddress = await wallet.getChangeAddress();
    console.log("Change Address:", changeAddress);

    // 674 = metadata label (CIP-20)
    const label = 674;

    // Formatage des métadonnées selon le format de metadata2.js
    const txMetadata = {
      msg: [
        `Agent: ${metadata.agent}`,
        `Plaque: ${metadata.plaque}`,
        `Usager: ${metadata.usager}`,
        `Description: #${metadata.infraction}`,
        `Montant: ${metadata.montant} USD`,
        `Timestamp: ${metadata.timestamp}`
      ]
    };

    // Initialisation du constructeur de transaction
    const txBuilder = new MeshTxBuilder({
      fetcher: provider,
      submitter: provider,
      verbose: true,
    });

    // Construction de la transaction avec métadonnées
    const unsignedTx = await txBuilder
      .metadataValue(label, txMetadata)
      .changeAddress(changeAddress)
      .selectUtxosFrom(utxos)
      .complete();

    // Signature et envoi de la transaction
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);

    console.log("Transaction hash:", txHash);
    return txHash;

  } catch (error) {
    console.error('Erreur lors de l\'envoi sur la blockchain:', error);
    throw new Error('Échec de l\'envoi sur la blockchain: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
  }
}
