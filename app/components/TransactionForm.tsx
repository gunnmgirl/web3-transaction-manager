"use client";
import { http, useAccount } from "wagmi";
import { useState } from "react";
import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";
import { Address, parseEther, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import Link from "next/link";
import Input from "app/components/Input";
import Button from "app/components/Button";
import { formatHash } from "app/helpers";
import { BUNDELER_URL, ETHERSCAN_SEPOLIA_URL } from "app/constants";

const TransactionForm = ({ isGasless }: { isGasless: boolean }) => {
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hash, setHash] = useState("");
  const { address } = useAccount();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsPending(true);
    setIsConfirmed(false);
    setHash("");
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const to = formData.get("address") as Address;
    const value = formData.get("value") as string;
    const etherValue = parseEther(value);

    try {
      const account = privateKeyToAccount(
        ("0x" + process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY) as Address
      );

      const signer = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
      });

      const smartWallet = await createSmartAccountClient({
        signer,
        bundlerUrl: BUNDELER_URL,
        ...(isGasless && {
          biconomyPaymasterApiKey:
            process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY,
        }),
      });

      const userOpResponse = await smartWallet.sendTransaction(
        {
          to,
          value: etherValue,
        },
        {
          ...(isGasless && {
            paymasterServiceData: { mode: PaymasterMode.SPONSORED },
          }),
        }
      );

      setIsPending(false);
      setIsConfirming(true);

      const { transactionHash } = await userOpResponse.waitForTxHash();
      if (transactionHash) {
        setHash(transactionHash);
      }

      const userOpReceipt = await userOpResponse.wait(100);
      if (userOpReceipt.success == "true") {
        setIsConfirming(false);
        setIsConfirmed(true);
      }
    } catch (error) {
      setIsPending(false);
      setIsConfirming(false);
      setIsConfirmed(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-evenly">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-end gap-4 justify-center"
      >
        <Input
          label="Address"
          name="address"
          placeholder="0xA0Cf…251e"
          required
        />
        <Input label="Value" name="value" placeholder="0.05" required />
        {address ? (
          <Button isActive type="submit" className="mt-2" disabled={isPending}>
            {isPending ? "Confirming..." : "Send"}
          </Button>
        ) : (
          <Button className="mt-2" disabled={true}>
            Connect Wallet
          </Button>
        )}
      </form>
      <div className="w-80 min-h-40">
        {hash && (
          <div className="flex justify-between">
            Transaction Hash:
            <Link
              href={`${ETHERSCAN_SEPOLIA_URL}/tx/${hash}`}
              rel="noopener noreferrer"
              target="_blank"
              className="text-indigo-500"
            >
              {formatHash(hash)}
            </Link>
          </div>
        )}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
      </div>
    </div>
  );
};

export default TransactionForm;
