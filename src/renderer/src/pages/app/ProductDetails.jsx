import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminApi } from "@/server/api";
import { currencyFormat, getImage } from "../../hooks/helper";
import PageLoading from "../../components/PageLoading";
import BaseHeader from "../../components/BaseHeader";
import BaseAlert from "../../components/BaseAlert";
import { Button } from "../../components/ui/button";
import { toast } from "../../hooks/use-toast";
import AddProduct from "../../components/Products/AddProduct";

export default function ProductDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await AdminApi.getProduct(id);
      setProduct(response.data);
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch product");
      setLoading(false)
    }
  };
  useEffect(() => {

    fetchProduct();
  }, [id]);


  const handleDelete = async () => {
    try {
      await AdminApi.deleteProduct(id);
      toast({
        variant: "success",
        description: "Product deleted successfully",
        className: 'z-50'
      });
      navigate({ pathname: '/products' })
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to delete product: " + err.message,
      });
    }
  };

  const toggleProductStatus = async () => {
    setUpdatingStatus(true);
    try {
      await AdminApi.updateProductStatus(id);
      setProduct((prev) => ({
        ...prev,
        status: prev.status === "available" ? "unavailable" : "available",
      }));
      toast({description: 'Status Updated.'})
    } catch (err) {
      console.log("Failed to update product status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <>
      <BaseHeader user={user} pageName={'Product Details'} />
      <div className="mx-auto">
        <div className="flex flex-col">
          {/* Product Image */}
          <div>
            <img
              src={getImage(product.image)}
              alt={product.name}
              className="w-fit h-auto max-h-96 object-cover rounded"
            />
          </div>


          {/* Product Details */}
          <div className="flex flex-col justify-center mt-5">
            <h2 className="text-3xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="text-lg font-bold mt-2">{currencyFormat(product.price)}</p>

            {/* Product Status */}
            <p className={`mt-3 font-semibold ${product.status === "available" ? "text-green-600" : "text-red-600"}`}>
              Status: {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </p>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4">
              <Button
                onClick={() => {
                  setIsAlertOpen(true)
                }}
                className="bg-gray-100 text-red-600  hover:bg-gray-200"
              >
                Delete
              </Button>
              <Button
                onClick={toggleProductStatus}
                className={`text-white  ${product.status === "available" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                  }`}
                disabled={updatingStatus}
              >
                {updatingStatus ? "Updating..." : product.status === "available" ? "Mark as Unavailable" : "Mark as Available"}
              </Button>


              <Button
                onClick={() => {
                  setProductOpen(true)
                }}
              >
                Edit Product
              </Button>
            </div>
          </div>
        </div>
      </div>
      <BaseAlert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        title="Are You Sure?"
        description="Are you sure you want to delete this product? This action cannot be undone."
        cancelText="Cancel"
        confirmText="Delete"
      />
      <AddProduct open={productOpen} setOpen={setProductOpen} refresh={fetchProduct} productData={product} isEdit={true} />
    </>
  );
}
