import { useEffect, useState } from "react";
import { AdminApi } from "../../server/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageLoading from "../../components/PageLoading";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { currencyFormat } from "../../hooks/helper";

export function Dashboard({ toast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
   const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await AdminApi.getStats();
        setStats(response.data);
        if (response.data.monthly_revenue) {
          setChartData(response.data.monthly_revenue);
        }
      } catch (err) {
        toast({
          variant: "destructive",
          description: "Failed to fetch stats " + err,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <PageLoading loading={loading} />;

//   const chartData = [
//     { month: "January", revenue: 5000 },
//     { month: "February", revenue: 7200 },
//     { month: "March", revenue: 6500 },
//     { month: "April", revenue: 8900 },
//     { month: "May", revenue: 10500 },
//     { month: "June", revenue: 7600 },
//     { month: "July", revenue: 9800 },
//     { month: "August", revenue: 11300 },
//     { month: "September", revenue: 9200 },
//     { month: "October", revenue: 8700 },
//     { month: "November", revenue: 9900 },
//     { month: "December", revenue: 12500 },
// ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#ff5266",
    },
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currencyFormat(stats.total_revenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+{stats.total_orders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+{stats.total_products}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Cashiers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+{stats.total_cashiers}</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-3">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="max-h-[500px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#ff5266" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
