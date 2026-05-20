import { ProductListTable } from "./ProductListTable";

export default function ProductRequestPage() {
  return (
    <ProductListTable
      statusFilter="REQUEST"
      title="Items Request Verification"
    />
  );
}
