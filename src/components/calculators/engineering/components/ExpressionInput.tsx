import React from "react";
import { Input } from "@/components/ui/input";

type Props = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
};

export const ExpressionInput = ({ inputRef, value, onChange }: Props) => {
  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter an expression"
      className="h-11 text-base font-medium"
    />
  );
};
