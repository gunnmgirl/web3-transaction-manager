"use client";
import { useAccount } from "wagmi";
import {
  useSendTransaction,
  useSmartAccount,
  useUserOpWait,
} from "@biconomy/use-aa";
import { Address, parseEther } from "viem";
import Link from "next/link";
import Input from "app/components/Input";
import Button from "app/components/Button";
import { formatHash } from "app/helpers";
import { PaymasterMode } from "@biconomy/account";

const TransactionForm = ({ isGasless }: { isGasless: boolean }) => {
  const { address, chain } = useAccount();
  const {
    mutate,
    isPending,
    data: userOpResponse,
    error: errorSendTransaction,
  } = useSendTransaction();
  const smartAccount = useSmartAccount();
  const {
    isLoading: waitIsPending,
    error: waitError,
    data: waitData,
  } = useUserOpWait(userOpResponse);

  const newHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const to = formData.get("address") as Address;
    const value = formData.get("value") as string;
    const etherValue = parseEther(value);

    mutate({
      transactions: {
        to,
        value: etherValue,
      },
      ...(isGasless && {
        options: { paymasterServiceData: { mode: PaymasterMode.SPONSORED } },
      }),
    });
  };

  return (
    <div className="flex flex-col items-center justify-evenly">
      <form
        onSubmit={newHandleSubmit}
        className="flex flex-col items-end gap-4 justify-center"
      >
        <Input
          label="Smart Account Address"
          name="smartAddress"
          placeholder="Please connect wallet"
          disabled
          value={smartAccount.smartAccountAddress}
        />
        <Input
          label="Address"
          name="address"
          placeholder="0xA0Cf…251e"
          required
          disabled={!address}
        />
        <Input
          label="Value"
          name="value"
          placeholder="0.05"
          required
          disabled={!address}
        />
        {address ? (
          <Button
            isActive
            type="submit"
            className="mt-2"
            disabled={isPending || waitIsPending}
          >
            {isPending || waitIsPending ? "Waiting..." : "Send"}
          </Button>
        ) : (
          <Button className="mt-2" disabled={true}>
            Connect Wallet
          </Button>
        )}
      </form>
      <div className="w-80 min-h-40">
        {waitData?.receipt?.transactionHash && (
          <div className="flex justify-between">
            Transaction Hash:
            <Link
              href={`${chain?.blockExplorers?.default?.url}/tx/${waitData.receipt.transactionHash}`}
              rel="noopener noreferrer"
              target="_blank"
              className="text-indigo-500"
            >
              {formatHash(waitData.receipt.transactionHash)}
            </Link>
          </div>
        )}
        {isPending && <div>Waiting for confirmation...</div>}
        {waitIsPending && (
          <div>Transaction confirmed, waiting to process...</div>
        )}
        {errorSendTransaction && (
          <div className="text-rose-500">{`Error message: ${errorSendTransaction}`}</div>
        )}
        {waitError && (
          <div className="text-rose-500">{`Error message: ${waitError}`}</div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
