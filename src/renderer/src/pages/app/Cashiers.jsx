import { useEffect, useState } from "react";
import { AdminApi } from "../../server/api";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import PageLoading from "../../components/PageLoading";
import { Button } from '../../components/ui/button'
import { Delete, Pencil, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { renderAvatarFallback } from "../../hooks/helper";
import BasePaginations from "../../components/BasePaginations";
import AddCashier from "../../components/Cashier/AddCashier";
import BaseAlert from "../../components/BaseAlert";
import { Input } from '../../components/ui/input';

export function Cashiers({ toast }) {
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cashierOpen, setCashierOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editableCashier, setEditableCashier] = useState({});
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteCashierId, setDeleteCashierId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCashiers = async (page = 1) => {
    try {
      const response = await AdminApi.getCashiers({
        page: page,
        search: search,
      });
      setCashiers(response.data);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to fetch stats " + err,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteCashierId) {
        await AdminApi.deleteCashier(deleteCashierId);
        toast({
          variant: "success",
          description: "Cashier deleted successfully",
          className: 'z-50',
        });
        fetchCashiers();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to delete cashier: " + err.message,
      });
    }
  };

  useEffect(() => {
    fetchCashiers();
    return () => {};
  }, [search]);

  if (loading) {
    return <PageLoading loading={loading} />;
  }

  return (
    <div>
      {/* Add Search Input */}
      <div className="mb-4 relative max-w-sm flex items-center">
        <Input
          type="text"
          className='w-full pl-8'
          placeholder="Search by cashier name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-2" size={20} color="gray"/>
      </div>

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
            <TableRow key={cashier.id} className="h-12">
              <TableCell className="flex items-center space-x-3">
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-primary text-white select-none">
                    {renderAvatarFallback(cashier.name || 'User')}
                  </AvatarFallback>
                </Avatar>
                <span>{cashier.name}</span>
              </TableCell>
              <TableCell>{cashier.email}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => {
                    setDeleteCashierId(cashier.id);
                    setIsAlertOpen(true);
                  }}
                  variant="icon"
                  className="text-red-500"
                >
                  <Delete />
                </Button>
                <Button
                  onClick={() => {
                    setIsEdit(true);
                    setEditableCashier(cashier);
                    setCashierOpen(true);
                  }}
                  variant="icon"
                >
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <BasePaginations
        current_page={cashiers?.current_page}
        last_page={cashiers?.last_page}
        onFetch={fetchCashiers}
      />
      <Button
        onClick={() => {
          setIsEdit(false);
          setCashierOpen(true);
        }}
        className="absolute right-10 bottom-10 md:bottom-10"
      >
        Add Cashier
      </Button>
      <AddCashier
        open={cashierOpen}
        setOpen={setCashierOpen}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        refresh={fetchCashiers}
        cashierData={editableCashier}
      />
      <BaseAlert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete this cashier?"
        description="This action cannot be undone. The cashier and their data will be permanently deleted."
        cancelText="Cancel"
        confirmText="Delete"
      />
    </div>
  );
}
