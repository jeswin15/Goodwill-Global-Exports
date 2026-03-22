import { useState, useEffect } from "react";
import { FileText, Award, ShieldCheck, Eye, X, CheckCircle, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/store";
import { License } from "@/lib/data";

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  Award,
  FileText,
  HelpCircle
};

export default function Licenses() {
  const [licenses, setLicenses] = useState<License[]>(store.getLicenses());
  const [selectedLicense, setSelectedLicense] = useState<null | License>(null);

  useEffect(() => {
    store.fetchLicenses();
    const unsubscribe = store.subscribe(() => {
      setLicenses(store.getLicenses());
    });
    return () => { unsubscribe(); };
  }, []);

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
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-white font-semibold text-sm">Internationally Certified</span>
            </div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white md:text-6xl mb-4">
              Licenses & Certifications
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 leading-relaxed">
              Our commitment to global quality and safety standards is verified by international certification bodies.
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
        <div className="grid gap-6 md:grid-cols-2">
          {licenses.map((license, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedLicense(license)}
              className="cursor-pointer group"
            >
              <Card className={`h-full bg-gradient-to-br ${license.gradient} border ${license.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
                {/* Decorative Blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl" />

                {/* View Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 rounded-full bg-white shadow-lg">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <CardContent className="p-8 relative z-10">
                  {/* Icon Badge */}
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ${license.iconColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {(() => {
                      const IconComponent = ICON_MAP[license.iconName] || HelpCircle;
                      return <IconComponent className="h-8 w-8" />;
                    })()}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl font-bold text-primary">
                      {license.title}
                    </h3>
                    <p className="text-sm font-semibold text-accent uppercase tracking-wider">
                      {license.issuer}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {license.description}
                    </p>
                  </div>

                  {/* View Certificate CTA */}
                  <div className="mt-6 flex items-center gap-3 text-sm font-bold text-primary group-hover:text-accent transition-colors">
                    <span>View Certificate</span>
                    <div className="h-px flex-1 bg-primary/20 group-hover:bg-accent/40 transition-colors" />
                    <Eye className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced License Modal */}
      <AnimatePresence>
        {selectedLicense && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLicense(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full"
                onClick={() => setSelectedLicense(null)}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="grid md:grid-cols-2">
                {/* Info Section */}
                <div className={`p-8 md:p-12 space-y-6 bg-gradient-to-br ${selectedLicense.gradient} relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl" />

                  <div className="relative z-10">
                    <div className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl ${selectedLicense.iconColor} mb-6`}>
                      {(() => {
                        const IconComponent = ICON_MAP[selectedLicense.iconName] || HelpCircle;
                        return <IconComponent className="h-10 w-10" />;
                      })()}
                    </div>

                    <div className="space-y-3">
                      <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
                        {selectedLicense.title}
                      </h2>
                      <p className="text-sm font-bold uppercase tracking-widest text-accent">
                        {selectedLicense.issuer}
                      </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-lg italic bg-white/50 backdrop-blur-sm p-4 rounded-lg">
                      "{selectedLicense.description}"
                    </p>

                    <div className="flex gap-3 pt-6">
                      <Button
                        className={`flex-1 bg-gradient-to-r ${selectedLicense.badgeGradient} text-white hover:shadow-xl transition-all`}
                        onClick={() => setSelectedLicense(null)}
                      >
                        Close Viewer
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedLicense(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Image Section */}
                <div className="bg-slate-100 p-8 flex items-center justify-center min-h-[400px] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
                  <img
                    src={selectedLicense.image}
                    alt={selectedLicense.title}
                    className="max-h-full w-auto shadow-2xl border-8 border-white transform hover:rotate-0 -rotate-2 transition-transform duration-300 relative z-10 rounded-lg"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
