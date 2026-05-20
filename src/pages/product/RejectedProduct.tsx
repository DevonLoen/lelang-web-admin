import { ProductListTable } from "./ProductListTable";

export default function ProductRejectedPage() {
  return (
    <ProductListTable statusFilter="REJECTED" title="Rejected Items Records" />
  );
}
