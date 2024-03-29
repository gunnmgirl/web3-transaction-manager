"use client";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TransactionForm from "app/components/TransactionForm";
import Switch from "app/components/Switch";
import Heart from "app/icons/Heart";

const Home = () => {
  const [isGasless, setIsGasless] = useState(true);
  return (
    <main className="grid min-h-screen grid-rows-[auto,1fr,auto] grid-cols-1 justify-center p-24">
      <div className="grid sm:grid-cols-[1fr,1fr,1fr] grid-rows-[auto,auto] gap-4 justify-center">
        <div className="sm:block hidden" />
        <div className="flex justify-center">
          <ConnectButton />
        </div>
        <Switch
          label="Gasless"
          checked={isGasless}
          onChange={() => {
            setIsGasless(!isGasless);
          }}
        />
      </div>
      <TransactionForm isGasless={isGasless} />
      <div className="flex gap-2 items-center justify-self-center">
        <span>Powered by Biconomy</span>
        <Heart />
      </div>
    </main>
  );
};

export default Home;
