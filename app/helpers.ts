export const formatHash = (hash: string) => {
  const start = hash.substring(0, 6);
  const end = hash.substring(hash.length - 4);

  return `${start}...${end}`;
};
