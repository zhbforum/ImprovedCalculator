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

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Calculators</NavigationMenuTrigger>
              <NavigationMenuContent className="z-[60]">
                <div className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                  <Link
                    to="/"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <House className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Home</div>
                      <div className="text-sm text-muted-foreground">
                        Welcome page
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/engineering"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <Calculator className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Engineering</div>
                      <div className="text-sm text-muted-foreground">
                        Trigonometry and advanced calculations
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/graph"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <ChartLine className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Graphic</div>
                      <div className="text-sm text-muted-foreground">
                        Graphing functions
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/finance"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <DollarSign className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Finance</div>
                      <div className="text-sm text-muted-foreground">
                        Loans and investments
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/matrix"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <Grid className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Matrix</div>
                      <div className="text-sm text-muted-foreground">
                        Matrix Operations
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/programming"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <CodeXml className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Programming</div>
                      <div className="text-sm text-muted-foreground">
                        Executing scripts
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/crypto"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <ChartCandlestick className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Crypto</div>
                      <div className="text-sm text-muted-foreground">
                        Crypto
                      </div>
                    </div>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
