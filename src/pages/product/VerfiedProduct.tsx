import { ProductListTable } from "./ProductListTable";

export default function ProductApprovedPage() {
  return (
    <ProductListTable
      statusFilter="VERIFIED"
      title="Verified Items Portfolio"
    />
  );
}
