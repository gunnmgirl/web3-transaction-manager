import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Props = {
  isActive?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { isActive, icon, children, className, ...rest } = props;

  return (
    <button
      ref={ref}
      type="button"
      className={clsx(
        "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        isActive
          ? "bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-indigo-500"
          : "bg-white/10 hover:bg-white/20",
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});

export default Button;
