import clsx from "clsx";
import { InputHTMLAttributes, useId } from "react";

type Props = {
  label: string;
  rightSection?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = (props: Props) => {
  const { label, rightSection, ...rest } = props;
  const inputId = useId();

  return (
    <div>
      <label
        htmlFor={inputId}
        className={clsx(
          "block text-base font-medium leading-6 text-white",
          props.disabled && "text-gray-500"
        )}
      >
        {label}
      </label>
      <div className={clsx(`relative rounded-md shadow-sm`, label && "mt-2")}>
        <input
          id={inputId}
          type="text"
          className={clsx(
            "block w-full rounded-md border-0 bg-white/10 px-2.5 py-1.5 pr-12 text-base text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            props.disabled && "text-gray-500"
          )}
          {...rest}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-white sm:text-sm">{rightSection}</span>
        </div>
      </div>
    </div>
  );
};

export default Input;
