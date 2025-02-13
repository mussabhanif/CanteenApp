import React from "react";
import { currencyFormat } from "../hooks/helper";

export const Receipt = React.forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className="p-4 max-w-md mx-auto bg-white font-mono">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Restaurant Name</h1>
        <p className="text-sm">123 Food Street, City</p>
        <p className="text-sm">Phone: (123) 456-7890</p>
      </div>

      {/* Order Info */}
      <div className="mb-4">
        <div className="flex justify-between border-b pb-2">
          <span>Customer:</span>
          <span>{order.customer_name || 'Walk-in Customer'}</span>
        </div>
        <div className="flex justify-between border-b py-2">
          <span>Order Date:</span>
          <span>{new Date(order.created_at).toLocaleString()}</span>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-4">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-2">Item</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Qty</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.product.name}</td>
              <td className="text-right py-2">{currencyFormat(item.product.price)}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">{currencyFormat(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="border-t-2 border-black pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>TOTAL:</span>
          <span>{currencyFormat(order.total_amount)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm">
        <p>Thank you for dining with us!</p>
        <p>** This is a computer generated receipt **</p>
      </div>
    </div>
  );
})
