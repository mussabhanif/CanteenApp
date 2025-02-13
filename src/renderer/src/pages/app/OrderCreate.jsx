import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import BaseHeader from "../../components/BaseHeader";
import { AdminApi } from "../../server/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currencyFormat } from "../../hooks/helper";
import { toast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  customer_name: z.string().optional(),
  cashier_id: z.string().optional(),
  items: z.array(
    z.object({
      product_id: z.string(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ),
});

export default function CreateOrder({ user }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      cashier_id: "",
      items: [],
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await AdminApi.getOrderCreateData();
        setProducts(response.data.products);
        setCashiers(response.data.cashiers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Add item or increase quantity
  const addItem = (product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { product_id: product.id, quantity: 1 }];
      }
    });
  };

  // Decrease quantity or remove item
  const decreaseItem = (productId) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === productId);
      if (existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.product_id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevItems.filter((item) => item.product_id !== productId);
      }
    });
  };

  const onSubmit = async (data) => {
    console.log("Submitting order:", { ...data, items });

    setLoading(true);
    try {
      const res = await AdminApi.createOrder({ ...data, items }); // Ensure items are passed
      console.log(res);

      toast({description: "Order Created Successfully!"});
      form.reset();
      setItems([]); // Clear items after submission
      navigate({pathname: '/orders'})
    } catch (error) {
      console.error("Order creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };


  return (
    <div className="mb-8">
      <BaseHeader user={user} pageName="Create Order" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer Name */}
          <div className="flex flex-wrap gap-4">
            {/* Customer Name */}
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-[200px]">
                  <FormLabel>Customer Name</FormLabel>
                  <Input placeholder="Enter customer name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select Cashier */}
            <FormField
              control={form.control}
              name="cashier_id"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-[200px]">
                  <FormLabel>Select Cashier</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a cashier" />
                    </SelectTrigger>
                    <SelectContent>
                      {cashiers.map((cashier) => (
                        <SelectItem key={cashier.id} value={cashier.id.toString()}>
                          {cashier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>



          {/* Product Selection Grid */}
          <h3 className="text-lg font-bold my-2">Select Products</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className="p-4 flex flex-col items-center text-center shadow-md cursor-pointer hover:bg-gray-100"
                onClick={() => addItem(product)}
              >
                <h4 className="font-bold">{product.name}</h4>
                <p className="text-sm text-gray-600">{currencyFormat(product.price)}</p>
                <Button type='button' size="sm" className="mt-2">
                  Add
                </Button>
              </Card>
            ))}
          </div>

          {/* Selected Items with Quantity Counter */}
          <h3 className="text-lg font-bold my-2">Selected Items</h3>
          <h3 className="text-lg font-bold my-2">Total Amount: {Number.parseInt(calculateTotal())}</h3>
          {items.length > 0 ? (
            items.map((item) => {
              const product = products.find((p) => p.id === item.product_id);
              return (
                <div key={item.product_id} className="flex items-center space-x-4 border p-2 rounded-lg">
                  <p className="flex-1">{product.name} - {currencyFormat(product.price * item.quantity)}</p>
                  <div className="flex items-center space-x-2">
                    <Button type='button' size="sm" onClick={() => decreaseItem(item.product_id)}>-</Button>
                    <span>{item.quantity}</span>
                    <Button type='button' size="sm" onClick={() => addItem(product)}>+</Button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No items selected</p>
          )}

          <h3 className="text-lg font-bold my-2">Total Amount: {currencyFormat(Number.parseInt(calculateTotal()))}</h3>

          <Button type="submit" className="w-fit mt-3" disabled={loading}>
            {loading ? "Creating Order..." : "Create Order"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
