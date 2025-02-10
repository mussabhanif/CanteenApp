import { useEffect, useState } from "react";
import { AdminApi } from "../../server/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageLoading from "../../components/PageLoading";
import { Button } from "../../components/ui/button";
import { Delete, Eye, Pencil } from "lucide-react";
import BasePaginations from "../../components/BasePaginations";

export function Products({ toast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (page = 1) => {
    try {
      const response = await AdminApi.getProducts({ page });
      setProducts(response.data);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to fetch products: " + err,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <PageLoading loading={loading} />;

  return (
   <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {products?.data?.length <= 0 && <p>No products found.</p>}
      {products?.data?.map((product) => (
        <Card key={product.id}>
          <CardHeader className='p-0'>
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-t-lg bg-primary" />
          </CardHeader>
          <CardContent className='p-4'>
            <CardTitle>{product.name}</CardTitle>
            <p className="text-sm text-gray-500 truncate">{product.description}</p>
            <p className="text-lg font-bold mt-2 text-primary">${product.price}</p>
            <div className="flex justify-between mt-4">
              <Button variant="icon" className="text-red-500">
                <Delete />
              </Button>
              <Button variant="icon" >
                <Eye />
              </Button>
              <Button variant="icon">
                <Pencil />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    <BasePaginations
    current_page={products?.current_page}
    last_page={products?.last_page}
    onFetch={fetchProducts}
  />
   </>
  );
}
