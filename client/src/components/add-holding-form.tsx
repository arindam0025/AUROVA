import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHoldingSchema } from "@shared/schema";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, Check } from "lucide-react";

const formSchema = insertHoldingSchema.extend({
  purchaseDate: z.string().min(1, "Purchase date is required"),
}).omit({ portfolioId: true });

type FormData = z.infer<typeof formSchema>;

interface AddHoldingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddHoldingForm({ onSuccess, onCancel }: AddHoldingFormProps) {
  // Example stock list (can be replaced with API or larger list)
  const STOCKS = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "JPM", name: "JPMorgan Chase & Co." },
    { symbol: "JNJ", name: "Johnson & Johnson" },
    { symbol: "META", name: "Meta Platforms Inc." },
    { symbol: "NFLX", name: "Netflix Inc." },
    { symbol: "AMD", name: "Advanced Micro Devices" },
    { symbol: "INTC", name: "Intel Corporation" },
    { symbol: "V", name: "Visa Inc." },
    { symbol: "MA", name: "Mastercard Inc." },
    { symbol: "DIS", name: "Walt Disney Co." },
    { symbol: "PYPL", name: "PayPal Holdings Inc." },
    { symbol: "ADBE", name: "Adobe Inc." },
    { symbol: "CRM", name: "Salesforce Inc." },
    { symbol: "ORCL", name: "Oracle Corporation" },
    { symbol: "CSCO", name: "Cisco Systems Inc." },
  ];

  const [symbolInput, setSymbolInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredStocks = STOCKS.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(symbolInput.toLowerCase()) ||
      stock.name.toLowerCase().includes(symbolInput.toLowerCase())
  ).slice(0, 6);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      shares: "",
      purchasePrice: "",
      purchaseDate: "",
    },
  });

  const validateSymbol = async (symbol: string) => {
    if (!symbol || symbol.length < 1) return;
    
    setIsValidating(true);
    try {
      const response = await fetch(`/api/validate-symbol/${symbol.toUpperCase()}`);
      const data = await response.json();
      
      if (!data.valid) {
        form.setError("symbol", { message: data.message || "Invalid symbol" });
      } else {
        form.clearErrors("symbol");
        toast({
          title: "Valid Symbol",
          description: `${data.symbol} - ${data.companyName}`,
        });
      }
    } catch (error) {
      form.setError("symbol", { message: "Error validating symbol" });
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        symbol: data.symbol.toUpperCase(),
        shares: parseFloat(data.shares),
        purchasePrice: parseFloat(data.purchasePrice),
        purchaseDate: new Date(data.purchaseDate).toISOString(),
      };

      await apiRequest("POST", "/api/holdings", payload);
      
      toast({
        title: "Success",
        description: `${payload.symbol} added to your portfolio`,
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add holding",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative z-10 bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-200/50">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Add New Holding
        </CardTitle>
        <p className="text-sm text-slate-600">Enter stock details to add to your portfolio</p>
      </CardHeader>
      <CardContent className="relative z-10 p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">Stock Symbol</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g., AAPL"
                        {...field}
                        value={symbolInput}
                        onChange={(e) => {
                          field.onChange(e);
                          setSymbolInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="h-12 px-4 rounded-xl border-slate-200/50 focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        data-testid="input-symbol"
                      />
                      {isValidating && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600"></div>
                        </div>
                      )}
                      {showSuggestions && symbolInput && (
                        <ul className="absolute z-50 w-full mt-1 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-xl max-h-48 overflow-auto">
                          {filteredStocks.map((stock) => (
                            <li
                              key={stock.symbol}
                              className="px-4 py-3 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 cursor-pointer transition-all duration-200 border-b border-slate-100/50 last:border-b-0"
                              onClick={() => {
                                field.onChange(stock.symbol);
                                setSymbolInput(stock.symbol);
                                setShowSuggestions(false);
                              }}
                            >
                              <div className="font-medium text-slate-900">{stock.symbol}</div>
                              <div className="text-sm text-slate-600">{stock.name}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">Shares</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      min="0"
                      step="0.0001"
                      {...field}
                      className="h-12 px-4 rounded-xl border-slate-200/50 focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      data-testid="input-shares"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">Purchase Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="150.25"
                      min="0"
                      step="0.01"
                      {...field}
                      className="h-12 px-4 rounded-xl border-slate-200/50 focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      data-testid="input-purchase-price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">Purchase Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="h-12 px-4 rounded-xl border-slate-200/50 focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      data-testid="input-purchase-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold shadow-xl rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0 group/btn relative overflow-hidden"
                data-testid="button-submit-holding"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3 relative z-10"></div>
                    <span className="relative z-10">Adding...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Add to Portfolio</span>
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                className="h-12 px-6 rounded-xl border-slate-200/50 hover:border-slate-300/50 hover:bg-slate-50 transition-all duration-300 transform hover:scale-105"
                data-testid="button-cancel-holding"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
