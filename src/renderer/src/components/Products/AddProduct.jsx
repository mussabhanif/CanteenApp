import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { AdminApi } from "../../server/api";
import { toast } from "../../hooks/use-toast";
import BaseImagePicker from "../BaseImagePicker";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  image: z.string().optional(),
});

export default function AddProduct({ isEdit = false, setIsEdit, open, setOpen, productData, refresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: productData?.name || "",
      description: productData?.description || "",
      price: productData?.price || "",
      image: productData?.image || "",
    },
  });

  const { setValue } = form;

  useEffect(() => {
    if (isEdit) {
      form.reset({
        name: productData?.name || "",
        description: productData?.description || "",
        price: productData?.price || "",
        image: "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        price: "",
        image: "",
      });
    }
  }, [productData, form, isEdit]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        await AdminApi.updateProduct(productData.id, data);
        toast({ description: "Product updated successfully!" });
      } else {
        await AdminApi.createProduct(data);
        toast({ description: "Product added successfully!" });
      }
      refresh();
      setOpen(false);
      form.reset();
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast({ variant: "destructive", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit" : "Add"} Product</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 mt-5">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea type="text" placeholder="Enter product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Picker */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <BaseImagePicker
                    onImageSelect={(croppedImage) => setValue("image", croppedImage)}
                    aspectRatio={16 / 9}
                    initialImage={form.getValues("image")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex mt-10">
              <Button type="submit" className="ml-auto" disabled={loading}>
                {loading ? "Submitting..." : isEdit ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
