import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import { store } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import Products from "@/pages/products";
import Admin from "@/pages/admin";
import Licenses from "@/pages/licenses";
import Contact from "@/pages/contact";
import Quote from "@/pages/quote";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/products" component={Products} />
          <Route path="/admin" component={Admin} />
          <Route path="/licenses" component={Licenses} />
          <Route path="/contact" component={Contact} />
          <Route path="/quote" component={Quote} />
          <Route path="/blog" component={Blog} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Router />
      <Toaster />
    </div>
  );
}

export default App;
