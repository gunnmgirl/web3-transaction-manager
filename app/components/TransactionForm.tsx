"use client";
import { useSendTransaction } from "wagmi";
import { Address, parseEther } from "viem";
import Input from "app/components/Input";
import Button from "app/components/Button";

const TransactionForm = () => {
  const { isPending, sendTransaction } = useSendTransaction();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const to = formData.get("address") as Address;
    const value = formData.get("value") as string;
    const etherValue = parseEther(value);

    sendTransaction({ to, value: etherValue });
  };

  return (
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
  );
};

export default TransactionForm;
