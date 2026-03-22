import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { FileText, Send, Building2, PackageCheck, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const quoteFormSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  country: z.string().min(2, "Destination country is required"),
  productInterest: z.string().min(1, "Please select a product category"),
  estimatedQuantity: z.string().min(1, "Estimated quantity is required"),
  frequency: z.string().min(1, "Order frequency is required"),
  additionalRequirements: z.string().optional(),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
});

export default function Quote() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof quoteFormSchema>>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      country: "",
      productInterest: "",
      estimatedQuantity: "",
      frequency: "One-time",
      additionalRequirements: "",
      agreedToTerms: false,
    },
  });
  const [isSuccess, setIsSuccess] = useState(false);

  async function onSubmit(values: z.infer<typeof quoteFormSchema>) {
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to submit request");

      toast({
        title: "CONFIRMED: Proposal Request Sent Successfully",
        description: "We have received your request. A confirmation email has been sent to " + values.email,
        duration: 5000,
        className: "bg-green-50 border-green-200"
      });

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Could not send quote request. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-secondary/20 py-16">
      <div className="container max-w-4xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <BadgeCheck className="mx-auto h-12 w-12 text-accent mb-4" />
          <h1 className="font-serif text-4xl font-bold text-primary uppercase tracking-tighter">GOODWILL GLOBAL EXPORTS Quotation</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Connect with our global supply network. Request a formal B2B proposal today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid gap-8"
        >
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <div className="bg-primary p-6 text-white flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif">Export Requirements Form</h2>
                <p className="text-primary-foreground/70 text-sm">Official GOODWILL GLOBAL EXPORTS Inquiry Channel.</p>
              </div>
            </div>

            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Business Details Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <Building2 className="h-4 w-4 text-accent" />
                      <h3 className="font-bold text-sm uppercase tracking-wider text-primary">Corporate Information</h3>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name *</FormLabel>
                            <FormControl><Input placeholder="Global Trade Ltd." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Authorized Representative *</FormLabel>
                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Email *</FormLabel>
                            <FormControl><Input type="email" placeholder="procurement@company.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number *</FormLabel>
                            <FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Export Needs Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <PackageCheck className="h-4 w-4 text-accent" />
                      <h3 className="font-bold text-sm uppercase tracking-wider text-primary">Logistics & Supply</h3>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination Port / Country *</FormLabel>
                            <FormControl><Input placeholder="e.g. United Kingdom" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="productInterest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Category *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="spices">Premium Spices</SelectItem>
                                <SelectItem value="grains">Organic Grains</SelectItem>
                                <SelectItem value="fruits">Seasonal Fruits</SelectItem>
                                <SelectItem value="nuts">Export Nuts</SelectItem>
                                <SelectItem value="other">Other Commodities</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="estimatedQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Metric Tons Required *</FormLabel>
                            <FormControl><Input placeholder="e.g. 50" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipment Frequency *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="One-time">Spot Order</SelectItem>
                                <SelectItem value="Monthly">Monthly Recurring</SelectItem>
                                <SelectItem value="Quarterly">Quarterly Supply</SelectItem>
                                <SelectItem value="Annual">Annual Partnership</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="additionalRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions / Certifications</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Detail any specific quality standards, private labeling, or custom packaging needs..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="agreedToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-secondary/10">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none text-xs">
                          <FormLabel>
                            By submitting this request, I authorize GOODWILL GLOBAL EXPORTS to process my data for the purpose of preparing a formal business quotation.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full h-12 text-lg bg-primary hover:bg-primary/90 btn-hover-effect uppercase font-bold tracking-widest disabled:opacity-70"
                  >
                    {form.formState.isSubmitting ? "Dispatching Request..." : (
                      <>Dispatch Proposal Request <Send className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
