"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TransactionForm from "app/components/TransactionForm";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <ConnectButton />
      <TransactionForm />
    </main>
  );
};

export default Home;
