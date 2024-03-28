import { InputHTMLAttributes, useId } from "react";

type Props = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Switch = (props: Props) => {
  const { label, ...rest } = props;
  const inputId = useId();

  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="ms-3 mr-2 text-base font-medium leading-6 text-white">
        {label}
      </span>
      <input type="checkbox" id={inputId} className="sr-only peer" {...rest} />
      <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
    </label>
  );
};

export default Switch;
