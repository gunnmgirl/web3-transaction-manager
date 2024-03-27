"use client";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Address, parseEther } from "viem";
import Link from "next/link";
import Input from "app/components/Input";
import Button from "app/components/Button";
import { formatHash } from "app/helpers";
import { ETHERSCAN_SEPOLIA_URL } from "app/constants";

const TransactionForm = () => {
  const { data: hash, isPending, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const to = formData.get("address") as Address;
    const value = formData.get("value") as string;
    const etherValue = parseEther(value);

    sendTransaction({ to, value: etherValue });
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
        <Button isActive type="submit" className="mt-2" disabled={isPending}>
          {isPending ? "Confirming..." : "Send"}
        </Button>
      </form>
      <div className="w-full min-h-40">
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
