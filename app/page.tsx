import { BICONOMY_API_BASE_URL } from "app/constants";
import { Paymaster } from "app/types";

async function getData() {
  const res = await fetch(`${BICONOMY_API_BASE_URL}/paymaster`, {
    headers: {
      authToken: process.env.NEXT_PUBLIC_BICONOMY_AUTH_TOKEN as string,
    },
  });

  if (!res.ok) {
    console.error("error on fetch data", res);
  }

  return res.json();
}

const Home = async () => {
  const results = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <ul>
          {results?.data?.map((item: Paymaster) => (
            <li key={item.paymasterId}>{item.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Home;
