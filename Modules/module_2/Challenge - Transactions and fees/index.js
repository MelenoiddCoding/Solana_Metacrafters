// Import Solana web3 functionalities
import {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} from "@solana/web3.js"

import { pair, walletAdress } from "../Keypair.js";


const DEMO_FROM_SECRET_KEY = new Uint8Array(pair.secretKey);

//Getting from and to keypairs, we can ask for the balance of each wallet asigned by the Public Key of each
const getWalletBalance = async (from, to) => {
    try{

        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        //get wallets balances from public keys
        const fromWalletBalance = await connection.getBalance(new PublicKey(from.publicKey))
        const toWalletBalance = await connection.getBalance(new PublicKey(to))
      
        //Show in console the actual balance in the wallet
        console.log(`from Wallet balance: ${parseInt(fromWalletBalance)/LAMPORTS_PER_SOL} SOL`);
        console.log(`to Wallet balance: ${parseInt(toWalletBalance)/LAMPORTS_PER_SOL} SOL`);
        
    } catch (err){
        console.log(err)
    }
}


const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    
    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
    // Generate another Keypair (account we'll be sending to)
    const to = walletAdress;

    //Balance before transaction
    const fromWalletBalance = await connection.getBalance(new PublicKey(from.publicKey));
    
    //Get wallet balance by passing 
    await getWalletBalance(from, to)
 

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            //Removed LAMPORTS_PER_SOL by already havind fromWalletBalance in lamports format
            lamports: fromWalletBalance  / 2
        })
    );
    
    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is ', signature);

    //Balance after transaction
    getWalletBalance(from, to)


}

transferSol();

