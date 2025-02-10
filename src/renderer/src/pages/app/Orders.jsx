import { useEffect, useState } from "react";
import { AdminApi } from "../../server/api";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import PageLoading from "../../components/PageLoading";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Delete, Eye } from "lucide-react";
import BasePaginations from "../../components/BasePaginations";

export function Orders({ toast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (page = 1) => {
    try {
      const response = await AdminApi.getOrders({ page });
      setOrders(response.data);
      console.log(response.data);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to fetch orders: " + err
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <PageLoading loading={loading} />;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white capitalize";
      case "completed":
        return "bg-green-500 text-white capitalize";
      case "cancelled":
        return "bg-red-500 text-white capitalize";
      default:
        return "bg-gray-500 text-white capitalize";
    }
  };

  return (
    <div>
      <Table>
        {orders?.data?.length <= 0 && <TableCaption>No orders found.</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total Items</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Cashier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.data?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.products.reduce((total, item) => total + item.pivot.quantity, 0)}</TableCell>
              <TableCell>${parseFloat(order.total_amount).toFixed(2)}</TableCell>
              <TableCell>{order.cashier?.name || "N/A"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="icon">
                  <Eye />
                </Button>
                <Button variant="icon" className="text-red-500">
                  <Delete />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <BasePaginations current_page={orders?.current_page} last_page={orders?.last_page} onFetch={fetchOrders} />
    </div>
  );
}
