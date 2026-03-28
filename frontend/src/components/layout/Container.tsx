import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}
export const Container: React.FC<ContainerProps> = ({ children, className, as: Component = "div", ...props }) => {
  return (
    <Component className={twMerge(clsx("max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8", className))} {...props}>
      {children}
    </Component>
  );
};
export default Container;
