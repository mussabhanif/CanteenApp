import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminApi } from "../../server/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageLoading from "../../components/PageLoading";
import { Button } from "../../components/ui/button";
import BasePaginations from "../../components/BasePaginations";
import AddProduct from "../../components/Products/AddProduct";
import { currencyFormat, getImage } from "../../hooks/helper";
import { Input } from '../../components/ui/input';
import { Search } from 'lucide-react';

export function Products({ toast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productOpen, setProductOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async (page = 1, searchQuery = '') => {
    try {
      const response = await AdminApi.getProducts({ page, search: searchQuery });
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


  const handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    setSearch(searchQuery);
    fetchProducts(1, searchQuery);
  };

  if (loading) return <PageLoading loading={loading} />;

  return (
    <>
      {/* Search input */}
      <div className="mb-4 relative max-w-sm flex items-center">
        <Input
          type="text"
          className="w-full pl-8"
          placeholder="Search by product name"
          value={search}
          onChange={handleSearchChange}
        />
        <Search className="absolute left-2" size={20} color="gray" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
        {products?.data?.length <= 0 && <p>No products found.</p>}
        {products?.data?.map((product) => (
          <Card key={product.id} onClick={() => navigate(`/product-details/${product.id}`)} className="cursor-pointer">
            <CardHeader className="p-0">
              <img src={getImage(product.image)} alt={product.name} className="w-full h-40 object-cover rounded-t-lg bg-primary" />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle>{product.name}</CardTitle>
              <p className="text-sm text-gray-500 truncate">{product.description}</p>
              <p className="text-lg font-bold mt-2 text-primary">{currencyFormat(product.price)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <BasePaginations current_page={products?.current_page} last_page={products?.last_page} onFetch={fetchProducts} />
      <Button
        onClick={() => setProductOpen(true)}
        className="absolute right-10 bottom-10 md:bottom-10"
      >
        Add Product
      </Button>
      <AddProduct open={productOpen} setOpen={setProductOpen} refresh={fetchProducts} />
    </>
  );
}
