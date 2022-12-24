// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");
const { Readline } = require("node:readline/promises");



const prompt = require('prompt-sync')();
let key = ''
let newPair = ''


const start = async () => { 
    try{
        const haveKey = prompt('Do you already have a wallet adress? (Y or N): ')
        haveKey === 'y' || haveKey === 'Y' ? (
        await login()
        ) : (
        haveKey === 'n' || haveKey === 'N' ? (
            await genNewKeyPair()
        ) : (
        await start())
        )  
    } catch (err) {
        console.log(err)
    }
    }


const genNewKeyPair = async () => {
    try{
        console.log('Generating new keyPair...')
        newPair = new Keypair()
        airDropSol()
    } catch (err){
        console.log(err)
    }
}

const login = async () => {
    try{
        // key = '14WYVhNQV9hHqU8rdpsZf53A2NZWQUHWvMvvBQ29WwXH'
        key = prompt('enter your public key: ')
        airDropSol()

    } catch (err){
        console.log(err)
    }
}


// Get the wallet balance from a given private key
const getWalletBalance = async () => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const walletBalance = await connection.getBalance(
           key !== '' ? 
           (
            new PublicKey(key)
           ) : (
            new PublicKey(newPair.publicKey)
           )
        );
        console.log('The wallet is: ', newPair.publicKey)
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
    
};

const airDropSol = async () => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // Request airdrop of 2 SOL to the wallet
        console.log("Airdropping some SOL to my wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            key !==''? 
            (
                new PublicKey(key)
            ) : (
                new PublicKey(newPair.publicKey)
            ),
            2 * LAMPORTS_PER_SOL,
        );
        await connection.confirmTransaction(fromAirDropSignature);
        await getWalletBalance()
    } catch (err) {
        console.log(err);
    }
};


start();