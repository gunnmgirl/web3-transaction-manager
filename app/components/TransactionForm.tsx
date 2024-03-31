"use client";
import { useAccount, useWalletClient } from "wagmi";
import { useState } from "react";
import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";
import { Address, parseEther } from "viem";
import Link from "next/link";
import Input from "app/components/Input";
import Button from "app/components/Button";
import { formatHash } from "app/helpers";
import { BUNDELER_URL, ETHERSCAN_SEPOLIA_URL } from "app/constants";

enum TransactionStatus {
  Pending = "pending",
  Confirming = "confirming",
  Confirmed = "confirmed",
}

const TransactionForm = ({ isGasless }: { isGasless: boolean }) => {
  const [status, setStatus] = useState<TransactionStatus | null>(null);
  const [error, setError] = useState("");
  const [hash, setHash] = useState("");
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [counter, setCounter] = useState(1);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setStatus(TransactionStatus.Pending);
    setError("");
    setHash("");
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const to = formData.get("address") as Address;
    const value = formData.get("value") as string;
    const etherValue = parseEther(value);

    try {
      if (!walletClient) {
        return;
      }

      const smartWallet = await createSmartAccountClient({
        signer: walletClient,
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
          nonceOptions: { nonceKey: counter },
        }
      );

      setStatus(TransactionStatus.Confirming);

      const { transactionHash } = await userOpResponse.waitForTxHash();
      if (transactionHash) {
        setHash(transactionHash);
      }

      const userOpReceipt = await userOpResponse.wait();
      if (userOpReceipt.success == "true") {
        setStatus(TransactionStatus.Confirmed);
      } else if (userOpReceipt.success == "false") {
        setStatus(null);
        setError(userOpReceipt.reason || "Could not send value");
      }
      setCounter(counter + 1);
    } catch (error) {
      setStatus(null);
      setError(error ? (error as string) : "Error on send transaction");
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
          <Button
            isActive
            type="submit"
            className="mt-2"
            disabled={status === TransactionStatus.Pending}
          >
            {status === TransactionStatus.Pending ? "Confirming..." : "Send"}
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
        {status === TransactionStatus.Confirming && (
          <div>Waiting for confirmation...</div>
        )}
        {status === TransactionStatus.Confirmed && (
          <div>Transaction confirmed.</div>
        )}
        {error && (
          <div className="text-rose-500">{`Error message: ${error}`}</div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
