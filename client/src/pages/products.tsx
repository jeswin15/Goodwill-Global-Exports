import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { store } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Globe, ShieldCheck, Search, ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Products() {
  const [, setLocation] = useLocation();
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [filter, setFilter] = useState<"All" | "Regular" | "Seasonal">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    store.fetchProducts();
    const unsubscribe = store.subscribe(() => {
      setProducts(store.getProducts());
    });
    return () => { unsubscribe(); };
  }, []);

  // Derived state for filtering and sorting
  const filteredProducts = products
    .filter(p => {
      const matchesCategory = filter === "All" || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      if (sortOrder === "desc") return b.name.localeCompare(a.name);
      return 0; // default (by ID/insertion order usually)
    });

  // Get counts for tabs
  const getCount = (cat: string) => {
    if (cat === "All") return products.length;
    return products.filter(p => p.category === cat).length;
  };

  // Get related products (same category, excluding current)
  const relatedProducts = selectedProduct
    ? products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-primary md:text-5xl uppercase tracking-tighter">GOODWILL GLOBAL EXPORTS</h1>
          <p className="mt-4 text-muted-foreground text-lg">Browse our premium selection of export-grade commodities.</p>
        </div>

        {/* Controls: Search, Filter, Sort */}
        <div className="mb-8 space-y-6">
          {/* Search & Sort Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center max-w-4xl mx-auto">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort: {sortOrder === 'default' ? 'Default' : sortOrder === 'asc' ? 'Name (A-Z)' : 'Name (Z-A)'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder("default")}>Default</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("asc")}>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("desc")}>Name (Z-A)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
            {["All", "Regular", "Seasonal"].map((tab) => (
              <Button
                key={tab}
                variant={filter === tab ? "default" : "outline"}
                onClick={() => setFilter(tab as any)}
                className={cn(
                  "h-10 sm:h-12 px-4 sm:px-8 font-bold transition-all rounded-full",
                  filter === tab ? "bg-accent text-white shadow-lg scale-105" : "hover:text-accent bg-white/50"
                )}
              >
                {tab}
                <span className="ml-2 text-xs opacity-80 bg-black/10 px-2 py-0.5 rounded-full">
                  {getCount(tab)}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                onClick={() => {
                  setSelectedProduct(product);
                  setActiveImage(null);
                }}
                className="cursor-pointer group"
              >
                <Card className="h-full overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-slate-50">
                  {/* Image Container with Gradient Overlay */}
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Category Badge - Floating */}
                    <Badge
                      variant="secondary"
                      className={cn(
                        "absolute top-4 right-4 uppercase font-bold text-xs px-3 py-1.5 backdrop-blur-md border border-white/20 shadow-lg",
                        product.category === "Seasonal"
                          ? "bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white"
                          : "bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white"
                      )}
                    >
                      {product.category}
                    </Badge>

                    {/* Hover Overlay with CTA */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                      <Button
                        variant="outline"
                        className="text-white border-2 border-white hover:bg-white hover:text-primary font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl"
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>

                    {/* Gallery Indicator */}
                    {product.gallery && product.gallery.length > 0 && (
                      <div className="absolute bottom-4 left-4 flex gap-1.5">
                        {[...Array(Math.min(product.gallery.length + 1, 4))].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-serif text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Features Row */}
                    <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-accent" />
                        <span>Export Ready</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                        <span>Certified</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <Package className="h-16 w-16 mx-auto text-muted/30 mb-4" />
            <p className="text-muted-foreground italic text-lg">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => {
        if (!open) {
          setSelectedProduct(null);
          setActiveImage(null);
        }
      }}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-white h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-muted p-6 flex flex-col gap-4">
            <div className="aspect-square w-full rounded-lg overflow-hidden bg-white relative">
              <img
                src={activeImage || selectedProduct?.image}
                alt={selectedProduct?.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            {/* Gallery Thumbnails */}
            {selectedProduct?.gallery && selectedProduct.gallery.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  onClick={() => setActiveImage(null)}
                  className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${!activeImage ? 'border-primary' : 'border-slate-200 hover:border-primary/50'}`}
                >
                  <img src={selectedProduct.image} alt="Main" className="w-full h-full object-cover" />
                </button>
                {selectedProduct.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-slate-200 hover:border-primary/50'}`}
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-white">
            <DialogHeader className="mb-6 text-left">
              <div className="flex items-center gap-2 mb-2 text-accent">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Certified Origin</span>
              </div>
              <DialogTitle className="text-3xl font-serif text-primary leading-tight">
                {selectedProduct?.name}
              </DialogTitle>
              <Badge className="w-fit mt-2 bg-secondary text-primary border-none">
                {selectedProduct?.category} Category
              </Badge>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm uppercase text-muted-foreground mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Product Description
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProduct?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-muted-foreground">Standard</span>
                  <span className="text-sm font-semibold text-primary">ISO 22000 Certified</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-muted-foreground">Logistics</span>
                  <span className="text-sm font-semibold text-primary">Global Air/Sea Freight</span>
                </div>
              </div>

              <Button
                onClick={() => setLocation("/quote")}
                className="w-full h-12 bg-primary text-white hover:bg-primary/90 mt-8 btn-hover-effect uppercase tracking-widest font-bold"
              >
                Request Quote for this Product
              </Button>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="pt-8 border-t mt-8">
                  <h4 className="font-bold text-sm uppercase text-muted-foreground mb-4">Related Products</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {relatedProducts.map(rp => (
                      <div
                        key={rp.id}
                        className="group cursor-pointer"
                        onClick={() => setSelectedProduct(rp)}
                      >
                        <div className="aspect-square bg-muted rounded-md overflow-hidden mb-2">
                          <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <p className="text-xs font-bold text-center group-hover:text-accent truncate">{rp.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}
