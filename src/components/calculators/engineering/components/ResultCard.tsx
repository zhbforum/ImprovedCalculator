import React from "react";

type Props = {
  result: string;
};

export const ResultCard = ({ result }: Props) => {
  return (
    <div className="rounded-2xl border bg-background/60 p-4 md:p-5">
      <div className="text-sm text-muted-foreground">Result</div>
      <div className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
        {result || "0"}
      </div>
    </div>
  );
};
