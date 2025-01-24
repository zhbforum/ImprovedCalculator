import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t mt-auto py-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2024 Calculator App. Developer:{" "}
          <a
            href="https://github.com/zhbforum"
            className="font-medium underline underline-offset-4 hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            zhbforum
          </a>
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/zhbforum/ImprovedCalculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;