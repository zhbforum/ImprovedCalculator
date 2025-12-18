import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  Calculator,
  ChartLine,
  DollarSign,
  Grid,
  CodeXml,
  House,
  ChartCandlestick,
} from "lucide-react";

import { Link } from "react-router-dom";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

type NavItemId =
  | "home"
  | "engineering"
  | "graph"
  | "finance"
  | "matrix"
  | "programming"
  | "crypto";

const Header = () => {
  const { t } = useTranslation("common");

  const items: Array<{
    id: NavItemId;
    to: string;
    icon: JSX.Element;
  }> = [
    { id: "home", to: "/", icon: <House className="h-5 w-5" /> },
    {
      id: "engineering",
      to: "/engineering",
      icon: <Calculator className="h-5 w-5" />,
    },
    { id: "graph", to: "/graph", icon: <ChartLine className="h-5 w-5" /> },
    { id: "finance", to: "/finance", icon: <DollarSign className="h-5 w-5" /> },
    { id: "matrix", to: "/matrix", icon: <Grid className="h-5 w-5" /> },
    {
      id: "programming",
      to: "/programming",
      icon: <CodeXml className="h-5 w-5" />,
    },
    {
      id: "crypto",
      to: "/crypto",
      icon: <ChartCandlestick className="h-5 w-5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {t("header.menu.trigger")}
              </NavigationMenuTrigger>

              <NavigationMenuContent className="z-[60]">
                <div className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      to={item.to}
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                    >
                      {item.icon}
                      <div>
                        <div className="font-medium">
                          {t(`header.items.${item.id}.title`)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t(`header.items.${item.id}.desc`)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
