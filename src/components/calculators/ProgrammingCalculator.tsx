import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Code, Play } from "lucide-react";

const ProgrammingCalculator = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageId, setLanguageId] = useState(63); 
  const [languages, setLanguages] = useState([]);
  const { toast } = useToast();
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY || "";

  useEffect(() => 
  {
    const fetchLanguages = async () => 
    {
      try 
      {
        const response = await fetch("https://ce.judge0.com/languages/all");
        const data = await response.json();
        setLanguages(data);
      } 
      catch (error) 
      {
        console.error("Error when enabling languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  const safeBase64Encode = (str: string): string => 
  {
    try 
    {
      return window.btoa(unescape(encodeURIComponent(str)));
    } 
    catch (e) 
    {
      console.error("Error while coding:", e);
      return "";
    }
  };

  const safeBase64Decode = (str: string): string => 
  {
    try 
    {
      return decodeURIComponent(escape(window.atob(str)));
    } 
    catch (e) 
    {
      console.error("Error while decoding:", e);
      return "Error when decoding result";
    }
  };

  const handleSubmit = async () => 
  {
    if (!apiKey)
      return toast(
     {
        title: "Error",
        description: "API key not found. Check the .env file.",
        variant: "destructive"
      });
    setIsLoading(true);
    try 
    {
      const encodedCode = safeBase64Encode(code);
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: encodedCode,
          stdin: "",
          base64_encoded: true
        })
      };
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true",
        options
      );
      const data = await response.json();
      if (!data.token) throw new Error("Failed to get token");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const resultResponse = await fetch(
        `https://judge0-ce.p.rapidapi.com/submissions/${data.token}?base64_encoded=true`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          }
        }
      );
      const resultData = await resultResponse.json();
      if (resultData.status.id === 3) {
        const decodedOutput = resultData.stdout
          ? safeBase64Decode(resultData.stdout)
          : "The program executed successfully, but did not return a result";
        setResult(decodedOutput);
      } else if (resultData.stderr) setResult(`Error: ${safeBase64Decode(resultData.stderr)}`);
      else if (resultData.compile_output) setResult(`Compile error: ${safeBase64Decode(resultData.compile_output)}`);
      else setResult("Unknown error");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute code",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-4xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <Code className="h-8 w-4" />
              Programming Calculator
            </h1>
            <p className="text-sm text-gray-500">
              Enter code and get the result of its execution in the selected language
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="language" className="text-sm text-gray-600">
                Choose a programming language:
              </label>
              <select
                id="language"
                value={languageId}
                onChange={(e) => setLanguageId(Number(e.target.value))}
                className="w-full h-12 px-4 py-2 rounded-md border border-gray-200 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code..."
              className="min-h-[200px] text-lg font-medium font-mono bg-white border-gray-200"
            />

            <Button
              onClick={handleSubmit}
              className="w-full h-12 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Execute Code
                </>
              )}
            </Button>

            {result && (
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="text-sm text-gray-600 mb-1">Result:</div>
                <div className="font-mono text-base text-blue-600 whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
export default ProgrammingCalculator;