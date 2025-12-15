export const TRIG_AND_LOG_BUTTONS = ["sin", "cos", "tan", "log"] as const;
export const ADVANCED_BUTTONS = ["√", "x²", "(", ")"] as const;

export const DIGIT_ROWS = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
] as const;

export const BOTTOM_ROW = ["0", ".", "=", "+"] as const;

export const ALLOWED_KEY_CHARS = "0123456789+-*/().^";

export const UI = {
  keyBtnClass:
    "h-12 text-[17px] md:text-[18px] font-medium tracking-tight leading-none tabular-nums",
  topBtnClass:
    "h-12 text-[15px] md:text-[16px] font-medium tracking-tight leading-none",
  kbdClass:
    "rounded-md border bg-background px-2 py-1 font-mono text-xs text-foreground",
} as const;
