// import functionalities
import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {useEffect , useState } from "react";
import { disconnect } from 'process';

// create types
type DisplayEncoding = "utf8" | "hex";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

// create a provider interface (hint: think of this as an object) to store the Phantom Provider
interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

/**
 * @description gets Phantom provider, if it exists
 */
 const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    // @ts-ignore
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }
};

function App() {
  // create state variable for the provider
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );

	// create state variable for the wallet key
  const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
  undefined
  );

  const [walletAccount, setWalletAccount] = useState('')

  // this is the function that runs whenever the component updates (e.g. render, refresh)
  useEffect(() => {
	  const provider = getProvider();

		// if the phantom provider exists, set this as the provider
	  if (provider) setProvider(provider);
	  else setProvider(undefined);
  }, []);

  /**
   * @description prompts user to connect wallet if it exists.
	 * This function is called when the connect wallet button is clicked
   */
  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

		// checks if phantom wallet exists
    if (solana) {
      try {
				// connects wallet and returns response which includes the wallet public key
        const response = await solana.connect();
        console.log('wallet account ', response.publicKey.toString());
        setWalletAccount(response.publicKey.toString())
				// update walletKey to be the public key
        setWalletKey(response.publicKey.toString());
      } catch (err) {
      // { code: 4001, message: 'User rejected the request.' }
      }
    }
  };

  const disconnectWallet = async () =>  {
    // @ts-ignore
    const {solana} = window
    console.log(solana);
    if (solana){
      try{
        await solana.disconnect();
        setWalletKey(undefined)
      } catch (err){
      // { code: 4001, message: 'User rejected the request.' }
      }
    }
    
  };

	// HTML code for the app
  return (
    <div className="App">
      {provider && !walletKey && (
        <div>
          <header className="App-header">
          <h2>Connect to Phantom Wallet</h2>
        </header>
          <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
        )}
        {provider && walletKey && 
          <div>
            <p>{walletAccount}</p>
            <p>Connected account</p> 
            <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onClick={disconnectWallet}
          >
            Disconnect wallet
          </button>
          </div>
        }

        {!provider && (
          <p>
            No provider found. Install{" "}
            <a href="https://phantom.app/">Phantom Browser extension</a>
          </p>
        )}
    </div>
  );
}

export default App;