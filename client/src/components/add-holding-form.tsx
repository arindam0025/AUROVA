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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Add New Holding</CardTitle>
            <p className="text-sm text-gray-500">Enter your investment details</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} data-testid="button-cancel-form">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-add-holding">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Symbol</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g., AAPL"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          field.onChange(value);
                          if (value.length >= 1) {
                            validateSymbol(value);
                          }
                        }}
                        data-testid="input-symbol"
                      />
                      {isValidating && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        </div>
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
                  <FormLabel>Shares</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      min="0"
                      step="0.0001"
                      {...field}
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
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="150.25"
                      min="0"
                      step="0.01"
                      {...field}
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
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      data-testid="input-purchase-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                data-testid="button-submit-holding"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Add to Portfolio
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-holding">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
