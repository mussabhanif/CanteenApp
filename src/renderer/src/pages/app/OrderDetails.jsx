import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BaseHeader from "../../components/BaseHeader";
import { AdminApi } from "../../server/api";
import PageLoading from "../../components/PageLoading";
import { useParams } from "react-router-dom";
import { currencyFormat, getImage } from "../../hooks/helper";
import { useReactToPrint } from "react-to-print";
import { Receipt } from "../../components/Receipt";
import moment from "moment/moment";

export default function OrderDetails({ user }) {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState({
    complete: false,
    cancel: false,
    print: false,
  });

  const receiptRef = useRef(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await AdminApi.getOrder(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const updateOrderStatus = async (status) => {
    try {
      setButtonLoading({ ...buttonLoading, [status]: true });
      await AdminApi.updateOrderStatus(orderId, { status });
      setOrder((prev) => ({ ...prev, status }));
      setButtonLoading({ complete: false, cancel: false, print: false });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    pageStyle: `
        @media print {
        @page {
          size: 80mm auto;
          margin: 0;
        }
      }
      `,
  });

  // const handlePrint = () => {
  //   // Get the receipt's HTML content
  //   const receiptHTML = receiptRef.current.outerHTML;

  //   // Send the receipt data to the Electron main process
  //   window.electron.ipcRenderer.send("print-receipt", receiptHTML);
  // }

  if (loading) return <PageLoading />;
  if (!order) return <p>Order not found.</p>;

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
    <div className="p-4">
      <BaseHeader user={user} pageName="Order Details" />

      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold mb-2">Order #{order.id}</h2>
          <h2 className="text-xl font-bold mb-2 text-primary">
            Total: {currencyFormat(order.total_amount)}
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start space-y-1">
            <p className="text-gray-600">Customer: {order.customer_name}</p>
            <p className="text-gray-600">Cashier: {order.cashier.name}</p>
            <p className="text-gray-600">Date: {moment(order.created_at).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <Badge variant="outline" className={"my-2 " + getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
          <Button onClick={handlePrint} disabled={buttonLoading.print}>
            {buttonLoading.print ? "Printing..." : "Print Receipt"}
          </Button>
        </div>

        {order.status === "pending" && (
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => updateOrderStatus("canceled")}>
              {buttonLoading.cancel ? "Canceling..." : "Cancel"}
            </Button>
            <Button onClick={() => updateOrderStatus("completed")}>
              {buttonLoading.complete ? "Completing..." : "Complete"}
            </Button>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <h3 className="text-lg font-bold mb-2">Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {order.items.map((item) => (
          <Card key={item.id} className="p-4 flex items-center shadow-md gap-2">
            <img
              src={getImage(item.product.image)}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-md mb-2"
            />
            <h4 className="font-bold truncate">{item.product.name}</h4>
            <p className="text-gray-600 whitespace-nowrap">Qty: {item.quantity}</p>
            <p className="text-primary font-bold ml-auto whitespace-nowrap">{currencyFormat(item.subtotal)}</p>
          </Card>
        ))}
      </div>

      {/* Hidden Receipt Component for Printing */}
      <div className="hidden">
        <Receipt ref={receiptRef} order={order} />
      </div>
    </div>
  );
}
