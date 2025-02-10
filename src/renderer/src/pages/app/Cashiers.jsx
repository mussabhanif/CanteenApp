import { useEffect, useState } from "react";
import { AdminApi } from "../../server/api";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import PageLoading from "../../components/PageLoading";
import { Button } from '../../components/ui/button'
import { Delete, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { renderAvatarFallback } from "../../hooks/helper";
import BasePaginations from "../../components/BasePaginations";
export function Cashiers({ toast }) {
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCashiers = async (page = 1) => {
    try {
      const response = await AdminApi.getCashiers({
        page: page
      });
      setCashiers(response.data);
      console.log(response.data);

    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to fetch stats " + err
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCashiers();
    return () => {};
  }, []);

  if (loading) {
    return <PageLoading loading={loading} />;
  }

  return (
    <div>
      <Table>
        {cashiers?.data?.length <= 0 && <TableCaption>No data found.</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashiers?.data.map((cashier) => (
            <TableRow key={cashier.id} className='h-12'>
              <TableCell className='flex items-center space-x-3'>
                <Avatar className='cursor-pointer '>
                  {/* <AvatarImage src={cashier?.avatar} /> */}
                  <AvatarFallback className='bg-primary text-white select-none'>
                    {renderAvatarFallback(cashier.name || 'User')}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {cashier.name}
                </span>
              </TableCell>
              <TableCell>{cashier.email}</TableCell>
              <TableCell className='text-right'>
                <Button variant='icon' className='text-red-500'>
                  <Delete />
                </Button>
                <Button variant='icon'>
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
          <BasePaginations current_page={cashiers?.current_page} last_page={cashiers?.last_page} onFetch={fetchCashiers}/>
    </div>
  );
}
