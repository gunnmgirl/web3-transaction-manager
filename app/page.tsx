"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TransactionForm from "app/components/TransactionForm";

const Home = () => {
  return (
    <main className="grid min-h-screen grid-rows-[auto,1fr] justify-center p-24">
      <div>
        <ConnectButton />
      </div>
      <TransactionForm />
    </main>
  );
};

export default Home;
