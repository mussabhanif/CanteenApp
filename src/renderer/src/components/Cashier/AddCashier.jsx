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

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

export default function AddCashier({ isEdit = false, setIsEdit, open, setOpen, cashierData, refresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cashierData?.name || "",
      email: cashierData?.email || "",
    },
  });

  useEffect(() => {
    if (isEdit) {
      form.reset({
        name: cashierData?.name || "",
        email: cashierData?.email || "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
      });
    }
  }, [cashierData, form, isEdit]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        await AdminApi.updateCashier(cashierData.id, data);
      } else {
        await AdminApi.createCashier(data);
      }
      refresh();
      setOpen(false);
      form.reset();
      setIsEdit(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} >
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit" : "Add"} Cashier</SheetTitle>
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
                    <Input type="text" placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex mt-10">
              <Button type="submit" className="ml-auto" disabled={loading}>
                {loading ? "Submitting..." : isEdit ? "Update Cashier" : "Add Cashier"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
