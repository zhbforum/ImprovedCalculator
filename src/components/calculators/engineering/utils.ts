export const convertToRadiansIfNeeded = (
  expression: string,
  isRadians: boolean
) => {
  if (isRadians) return expression;

  return expression.replace(
    /(sin|cos|tan)\((.*?)\)/g,
    (_, func, angle) => `${func}((${angle}) * PI / 180)`
  );
};

export const autoCloseParentheses = (expression: string): string => {
  let balance = 0;

  for (const char of expression) {
    if (char === "(") balance += 1;
    else if (char === ")" && balance > 0) balance -= 1;
  }

  return balance > 0 ? expression + ")".repeat(balance) : expression;
};

export const isTypingInInputLike = (el: Element | null) => {
  if (!el) return false;
  const tag = (el as HTMLElement).tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea") return true;
  return (el as HTMLElement).isContentEditable === true;
};

export const tabBtnClass = (active: boolean) =>
  [
    "h-9 rounded-full border px-3 text-sm transition",
    active
      ? "bg-background/80 text-foreground"
      : "bg-background/40 text-muted-foreground hover:bg-background/60",
  ].join(" ");
