import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Snowfall from "react-snowfall";

import Index from "./pages/Index";
import Graph from "./pages/Graph";
import Finance from "./pages/Finance";
import Matrix from "./pages/Matrix";
import Engineering from "./pages/Engineering";
import Programming from "./pages/Programming";
import CryptoRates from "./pages/Crypto";
import { Sonner } from "@/components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Snowfall
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
        }}
        snowflakeCount={140}
      />

      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/engineering" element={<Engineering />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/matrix" element={<Matrix />} />
          <Route path="/programming" element={<Programming />} />
          <Route path="/crypto" element={<CryptoRates />} />
        </Routes>
      </Router>

      <Sonner />
    </QueryClientProvider>
  );
}

export default App;
