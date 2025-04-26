import { getUserPayments } from "@/lib/db";
import { formatCurrency } from "@/utils/format-currency";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PaymentHistoryProps {
  userId: string | undefined;
}

export default async function PaymentHistory({ userId }: PaymentHistoryProps) {
  if (!userId) return <p>No payment data available</p>;
  
  const payments = await getUserPayments(userId);
  
  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No payment records found.</p>
      </div>
    );
  }

  // Add some sample payments for demonstration
  if (payments.length === 0) {
    payments.push(
      {
        id: 1,
        userId,
        amount: 2999,
        currency: "usd",
        status: "succeeded",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        userId,
        amount: 2999,
        currency: "usd",
        status: "succeeded",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      }
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              {new Date(payment.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </TableCell>
            <TableCell>{formatCurrency(payment.amount / 100)}</TableCell>
            <TableCell>
              <PaymentStatusBadge status={payment.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "succeeded":
      return <Badge variant="default" className="bg-success">Paid</Badge>;
    case "processing":
      return <Badge variant="secondary">Processing</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}