import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Send, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });
  const [isSuccess, setIsSuccess] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to send message");

      toast({
        title: "Message Sent Successfully",
        description: "We have received your inquiry. A confirmation email has been sent to " + values.email,
        duration: 5000,
        className: "bg-green-50 border-green-200"
      });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent py-20 md:py-28 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container px-4 text-center relative z-10 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white md:text-6xl mb-4">
              GOODWILL GLOBAL EXPORTS
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Connect with our global trade headquarters. We're here to help.
            </p>
          </motion.div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="container px-4 py-16 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-accent font-bold tracking-wider uppercase text-sm bg-accent/10 px-4 py-2 rounded-full inline-block">
                Get in Touch
              </span>
              <h2 className="font-serif text-3xl font-semibold text-primary">
                Let's Start a Conversation
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Our export specialists are available for consultation. Reach out for technical specifications, bulk pricing, and custom logistics solutions.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: MapPin,
                  title: "Global Headquarters",
                  content: "51/7-5, Mani Complex,Sangagiri Road, Namakkal, Tamil Nadu - 637209",
                  gradient: "from-blue-500/20 to-cyan-500/20",
                  iconColor: "text-blue-600",
                  borderColor: "border-blue-200"
                },
                {
                  icon: Phone,
                  title: "Direct Hotline",
                  content: "+91 74491 59999",
                  gradient: "from-emerald-500/20 to-teal-500/20",
                  iconColor: "text-emerald-600",
                  borderColor: "border-emerald-200"
                },
                {
                  icon: Mail,
                  title: "Official Email",
                  content: "contact@goodwillglobal.com",
                  gradient: "from-purple-500/20 to-pink-500/20",
                  iconColor: "text-purple-600",
                  borderColor: "border-purple-200"
                },
                {
                  icon: Clock,
                  title: "Business Hours",
                  content: "Mon - Fri: 9:00 AM - 6:00 PM IST\nSat: 10:00 AM - 2:00 PM IST",
                  gradient: "from-amber-500/20 to-orange-500/20",
                  iconColor: "text-amber-600",
                  borderColor: "border-amber-200"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <Card className={`bg-gradient-to-br ${item.gradient} border ${item.borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-white shadow-md ${item.iconColor}`}>
                          <item.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                          <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form with Enhanced Design */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-white to-slate-50">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl" />

              <CardContent className="p-8 md:p-10 relative z-10">
                <div className="mb-8">
                  <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                    Send Us a Message
                  </h3>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Full Name / Business Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              {...field}
                              className="h-12 bg-white border-2 focus:border-primary transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Business Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your.email@company.com"
                              {...field}
                              className="h-12 bg-white border-2 focus:border-primary transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Inquiry Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide details about your export requirements..."
                              className="min-h-[140px] bg-white border-2 focus:border-primary transition-colors resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting || isSuccess}
                      className={`w-full h-14 text-white font-bold text-lg transition-all duration-300 shadow-lg ${isSuccess
                          ? "bg-green-600 hover:bg-green-600"
                          : "bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:scale-[1.02]"
                        }`}
                    >
                      {form.formState.isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending Message...
                        </span>
                      ) : isSuccess ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          Message Sent Successfully
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          Submit Inquiry to Exports Team
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
