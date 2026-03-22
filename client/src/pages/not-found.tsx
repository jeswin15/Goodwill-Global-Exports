import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md mx-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 10 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.3,
                  delay: 0.5
                }}
              >
                <AlertCircle className="h-8 w-8 text-red-500" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Did you forget to add the page to the router?
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
