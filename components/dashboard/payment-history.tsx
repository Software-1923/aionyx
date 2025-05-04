import { getUserPayments } from "../../lib/db";
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
          <TableRow key={String(payment.id)}>
            <TableCell>
              {new Date(String(payment.createdAt ?? "")).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </TableCell>
            <TableCell>{formatCurrency((Number(payment.amount ?? 0)) / 100)}</TableCell>
            <TableCell>
              <PaymentStatusBadge status={String(payment.status ?? "unknown")} />
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