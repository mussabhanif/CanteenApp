import { useEffect, useState } from "react";
import { AdminApi } from "../../server/api";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import PageLoading from "../../components/PageLoading";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Delete, Eye, Search } from "lucide-react";
import BasePaginations from "../../components/BasePaginations";
import { currencyFormat } from "../../hooks/helper";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";

export function Orders({ toast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();


  const fetchOrders = async (page = 1) => {
    try {
      console.log(statusFilter);

      const response = await AdminApi.getOrders({
        page,
        search,
        status: statusFilter,
      });
      setOrders(response.data);
      console.log(response.data);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to fetch orders: " + err,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

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
      {/* Search Input */}
      <div className="mb-4 relative max-w-sm flex items-center">
        <Input
          type="text"
          className="w-full pl-8"
          placeholder="Search by customer or cahsier"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-2" size={20} color="gray" />
      </div>

      {/* Status Filter Tabs */}
      {/* <div className="mb-4">
        <Button onClick={() => setStatusFilter("")}  className={`mr-2 ${statusFilter === '' ? 'bg-primary' : 'bg-white hover:bg-gray-100 border text-black'}`}>
          All
        </Button>
        <Button onClick={() => setStatusFilter("pending")}  className={`mr-2 ${statusFilter === 'pending' ? 'bg-primary' : 'bg-white hover:bg-gray-100 border text-black'}`}>
          Pending
        </Button>
        <Button onClick={() => setStatusFilter("completed")}  className={`mr-2 ${statusFilter === 'completed' ? 'bg-primary' : 'bg-white hover:bg-gray-100 border text-black'}`}>
          Completed
        </Button>
        <Button onClick={() => setStatusFilter("cancelled")} className={`mr-2 ${statusFilter === 'cancelled' ? 'bg-primary' : 'bg-white hover:bg-gray-100 border text-black'}`}>
          Cancelled
        </Button>
      </div> */}

      {/* Orders Table */}
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
              <TableCell>{currencyFormat(order?.total_amount)}</TableCell>
              <TableCell>{order.cashier?.name || "N/A"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button onClick={() => navigate({ pathname: `/order-details/${order.id}` })} variant="icon">
                  <Eye />
                </Button>
                {/* <Button variant="icon" className="text-red-500">
                  <Delete />
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <BasePaginations current_page={orders?.current_page} last_page={orders?.last_page} onFetch={fetchOrders} />

      {/* Create Order Button */}
      <Button
        onClick={() => navigate({ pathname: '/order-create' })}
        className="absolute right-10 bottom-10 md:bottom-10"
      >
        Create Order
      </Button>
    </div>
  );
}
