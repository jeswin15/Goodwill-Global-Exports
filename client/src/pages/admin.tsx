import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { store } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, LogOut, Package, Newspaper, MessageSquare, Image as ImageIcon, Type, FileText, Lock, User, Briefcase, Minus as MinusIcon, ShieldCheck, Award, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [blogs, setBlogs] = useState<any[]>(store.getBlogs());
  const [testimonials, setTestimonials] = useState<any[]>(store.getTestimonials());
  const [licenses, setLicenses] = useState<any[]>(store.getLicenses());
  const { toast } = useToast();

  useEffect(() => {
    store.fetchProducts();
    store.fetchBlogs();
    store.fetchTestimonials();
    store.fetchLicenses();
    const unsubscribe = store.subscribe(() => {
      setProducts(store.getProducts());
      setBlogs(store.getBlogs());
      setTestimonials(store.getTestimonials());
      setLicenses(store.getLicenses());
    });
    return () => { unsubscribe(); };
  }, []);

  const [formData, setFormData] = useState({
    title: "", // Name/Title
    description: "", // Content
    category: "Regular", // Product Category
    blogCategory: "Industry Trends", // Blog Category
    author: "", // Blog Author
    image: "/images/product-spice.png",
    gallery: [] as string[], // Product Gallery
    role: "", // only for testimonial
    issuer: "", // only for license
    type: "product" as "product" | "blog" | "testimonial" | "license",
    id: null as number | null // for editing
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      toast({ title: "Welcome back", description: "Successfully logged into Admin Portal" });
    } else {
      toast({ title: "Login Failed", description: "Invalid credentials", variant: "destructive" });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isGallery) {
          setFormData(prev => ({ ...prev, gallery: [...prev.gallery, base64String] }));
        } else {
          setFormData({ ...formData, image: base64String });
        }
        toast({ title: "Image Uploaded", description: "Image has been encoded." });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  const handleAddItem = async () => {
    if (!formData.title || !formData.description) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    let success = false;
    if (formData.type === "product") {
      const product: Product = {
        id: Date.now(),
        name: formData.title,
        description: formData.description,
        category: formData.category as "Regular" | "Seasonal",
        image: formData.image,
        gallery: formData.gallery
      };
      success = await store.addProduct(product);
      if (success) toast({ title: "Success", description: "Product added to catalog" });
    } else if (formData.type === "blog") {
      const blog = {
        id: Date.now(),
        title: formData.title,
        content: formData.description,
        image: formData.image,
        author: formData.author || "GOODWILL GLOBAL EXPORTS",
        category: formData.blogCategory,
        date: new Date().toLocaleDateString()
      };
      success = await store.addBlog(blog);
      if (success) toast({ title: "Success", description: "Blog post published" });
    } else if (formData.type === "testimonial") {
      const testimonial = {
        id: Date.now(),
        name: formData.title,
        role: formData.role || "Client",
        content: formData.description,
        image: formData.image
      };
      success = await store.addTestimonial(testimonial);
      if (success) toast({ title: "Success", description: "Testimonial added" });
    } else if (formData.type === "license") {
      const license = {
        title: formData.title,
        issuer: formData.issuer,
        description: formData.description,
        image: formData.image
      };
      
      if (formData.id) {
        success = await store.updateLicense(formData.id, license);
        if (success) toast({ title: "Success", description: "License updated" });
      } else {
        success = await store.addLicense(license);
        if (success) toast({ title: "Success", description: "License added" });
      }
    }

    if (success) {
      setFormData({
        title: "",
        description: "",
        category: "Regular",
        blogCategory: "Industry Trends",
        author: "",
        image: "/images/product-spice.png",
        gallery: [],
        role: "",
        issuer: "",
        type: "product",
        id: null
      });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    store.removeProduct(id);
    toast({ title: "Deleted", description: "Product removed" });
  };

  const handleDeleteBlog = (id: number) => {
    store.removeBlog(id);
    toast({ title: "Deleted", description: "Blog removed" });
  };

  const handleDeleteTestimonial = (id: number) => {
    store.removeTestimonial(id);
    toast({ title: "Deleted", description: "Testimonial removed" });
  }

  const handleDeleteLicense = (id: number) => {
    store.removeLicense(id);
    toast({ title: "Deleted", description: "License removed" });
  };

  const handleEditLicense = (license: any) => {
    setFormData({
      title: license.title,
      description: license.description,
      category: "Regular",
      blogCategory: "Industry Trends",
      author: "",
      image: license.image,
      gallery: [],
      role: "",
      issuer: license.issuer,
      type: "license",
      id: license.id
    });
    setIsDialogOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-secondary/20 px-4">
        <Card className="w-full max-w-md border-none shadow-2xl">
          <CardHeader className="bg-primary text-white text-center rounded-t-lg">
            <Lock className="h-12 w-12 mx-auto mb-4 text-accent" />
            <h1 className="font-serif text-2xl font-bold uppercase tracking-tight">GOODWILL GLOBAL EXPORTS</h1>
            <p className="text-primary-foreground/70 text-sm">Secure Access Required</p>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary/50"
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50"
                  placeholder="Enter password"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90 btn-hover-effect">
                Enter Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row border-b pb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary md:text-5xl uppercase tracking-tighter">GOODWILL GLOBAL EXPORTS</h1>
            <p className="mt-2 text-muted-foreground">Global Content Management Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary text-white btn-hover-effect h-12 px-6">
                  <Plus className="h-4 w-4" /> Create New Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif">Add New Content</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label>Content Type</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={formData.type === 'product' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setFormData({ ...formData, type: 'product' })}
                      >
                        <Package className="mr-2 h-4 w-4" /> Product
                      </Button>
                      <Button
                        variant={formData.type === 'blog' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setFormData({ ...formData, type: 'blog' })}
                      >
                        <Newspaper className="mr-2 h-4 w-4" /> Blog
                      </Button>
                      <Button
                        variant={formData.type === 'testimonial' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setFormData({ ...formData, type: 'testimonial' })}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" /> Review
                      </Button>
                      <Button
                        variant={formData.type === 'license' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setFormData({ ...formData, type: 'license', id: formData.type === 'license' ? formData.id : null })}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" /> License
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="title" className="flex items-center gap-2">
                      {formData.type === 'testimonial' ? <User className="h-4 w-4 text-accent" /> : formData.type === 'license' ? <ShieldCheck className="h-4 w-4 text-accent" /> : <Type className="h-4 w-4 text-accent" />}
                      {formData.type === 'product' ? 'Product Name' : formData.type === 'testimonial' ? 'Client Name' : formData.type === 'license' ? 'License Title' : 'Blog Title'} *
                    </Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder={formData.type === 'license' ? "ISO 22000:2018..." : formData.type === 'testimonial' ? "Client Name..." : "Enter title..."} />
                  </div>

                  {formData.type === 'license' && (
                    <div className="grid gap-2">
                      <Label htmlFor="issuer" className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-accent" /> Issuing Body / Authority *
                      </Label>
                      <Input id="issuer" value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} placeholder="Directorate General of Foreign Trade..." />
                    </div>
                  )}

                  {formData.type === 'testimonial' && (
                    <div className="grid gap-2">
                      <Label htmlFor="role" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-accent" /> Role / Company
                      </Label>
                      <Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="CEO, Global Foods..." />
                    </div>
                  )}

                  {formData.type === 'product' && (
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(val: any) => setFormData({ ...formData, category: val })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Seasonal">Seasonal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.type === 'blog' && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="blogCategory">Category</Label>
                        <Select value={formData.blogCategory} onValueChange={(val: any) => setFormData({ ...formData, blogCategory: val })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Industry Trends">Industry Trends</SelectItem>
                            <SelectItem value="Logistics">Logistics</SelectItem>
                            <SelectItem value="Company News">Company News</SelectItem>
                            <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="author">Author Name</Label>
                        <Input id="author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="e.g. Market Analyst" />
                      </div>
                    </>
                  )}

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-accent" /> {formData.type === 'testimonial' ? 'Client Photo' : 'Image Upload'} (JPG, PNG, WEBP)
                    </Label>
                    <div className="flex flex-col gap-4">
                      <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="cursor-pointer" />
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">or image url</span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                    </div>
                    {formData.image && (
                      <div className="mt-2 max-w-[200px] aspect-video overflow-hidden rounded-md border shadow-sm">
                        <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}

                    {formData.type === 'product' && (
                      <div className="space-y-2 mt-4">
                        <Label>Additional Gallery Images</Label>
                        <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="cursor-pointer" />
                        <div className="flex gap-2 flex-wrap mt-2">
                          {formData.gallery.map((img, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border">
                              <img src={img} className="w-full h-full object-cover" />
                              <button onClick={() => removeGalleryImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                                <MinusIcon className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent" /> {formData.type === 'testimonial' ? 'Testimonial Content' : 'Description / Content'} *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[150px]"
                      placeholder="Write detailed information here..."
                    />
                  </div>
                </div>
                <Button onClick={handleAddItem} className="w-full h-12 bg-primary btn-hover-effect">
                  Confirm & Publish
                </Button>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="h-12" onClick={() => setIsAuthenticated(false)}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8 bg-secondary/50 p-1">
            <TabsTrigger value="products" className="px-8"><Package className="mr-2 h-4 w-4" /> Products</TabsTrigger>
            <TabsTrigger value="blogs" className="px-8"><Newspaper className="mr-2 h-4 w-4" /> Blogs</TabsTrigger>
            <TabsTrigger value="testimonials" className="px-8"><MessageSquare className="mr-2 h-4 w-4" /> Testimonials</TabsTrigger>
            <TabsTrigger value="licenses" className="px-8"><ShieldCheck className="mr-2 h-4 w-4" /> Licenses</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Card className="overflow-hidden group hover:shadow-xl transition-shadow h-full flex flex-col">
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-primary">{product.name}</h3>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="ghost" size="sm" className="text-destructive w-full hover:bg-destructive/10" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Remove Product
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="blogs">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {blogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Card className="overflow-hidden group hover:shadow-xl transition-shadow h-full flex flex-col">
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img src={blog.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <CardHeader className="p-4">
                        <h3 className="font-bold text-lg text-primary">{blog.title}</h3>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <Badge variant="outline">{blog.category || "General"}</Badge>
                          <span>{blog.date}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex-grow">
                        <p className="text-sm line-clamp-3 text-muted-foreground">{blog.content}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="ghost" size="sm" className="text-destructive w-full hover:bg-destructive/10" onClick={() => handleDeleteBlog(blog.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Remove Blog
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              {blogs.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed rounded-lg bg-secondary/10">
                  <p className="text-muted-foreground italic">No blog posts yet. Click 'Create New Content' to start writing.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Card className="overflow-hidden group hover:shadow-xl transition-shadow h-full flex flex-col">
                      <div className="aspect-[21/9] bg-muted overflow-hidden flex items-center justify-center p-4">
                        <img src={testimonial.image} className="h-20 w-20 rounded-full object-cover ring-4 ring-white" />
                      </div>
                      <CardHeader className="p-4 text-center">
                        <h3 className="font-bold text-lg text-primary">{testimonial.name}</h3>
                        <p className="text-xs text-muted-foreground uppercase">{testimonial.role}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex-grow text-center">
                        <p className="text-sm italic text-muted-foreground line-clamp-4">"{testimonial.content}"</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="ghost" size="sm" className="text-destructive w-full hover:bg-destructive/10" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Remove Testimonial
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              {testimonials.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed rounded-lg bg-secondary/10">
                  <p className="text-muted-foreground italic">No testimonials yet. Click 'Create New Content' to add one.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="licenses">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {licenses.map((license) => (
                  <motion.div
                    key={license.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Card className={`overflow-hidden group hover:shadow-xl transition-shadow h-full flex flex-col bg-gradient-to-br ${license.gradient}`}>
                      <div className="aspect-video bg-white/20 overflow-hidden relative p-4 flex items-center justify-center border-b border-white/10">
                        <img src={license.image} alt={license.title} className="max-h-full w-auto object-contain rounded shadow-lg ring-4 ring-white" />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-primary line-clamp-1">{license.title}</h3>
                        </div>
                        <p className="text-xs font-bold text-accent uppercase tracking-wider">{license.issuer}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3 italic">"{license.description}"</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditLicense(license)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 px-3" onClick={() => handleDeleteLicense(license.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              {licenses.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed rounded-lg bg-secondary/10">
                  <p className="text-muted-foreground italic">No licenses yet. Click 'Create New Content' to add one.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
