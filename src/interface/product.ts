type Condition = "new" | "used";
export type Status =
  | "draft"
  | "requested"
  | "verified"
  | "on bids"
  | "rejected"
  | "completed";

export interface Product {
  id: number;
  userId: number;
  coverImageUrl: string;
  imageUrls: string[];
  name: string;
  userName: string;
  description: string;
  submissionDate: Date;
  condition: Condition;
  status: Status;
  createdAt: string;
}
