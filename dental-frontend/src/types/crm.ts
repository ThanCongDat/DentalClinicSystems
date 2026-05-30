export interface MembershipTierDTO {
  id: number;
  name: string;
  level: string;
  minimumPoints: number;
  discountPercent: number;
  pointsPerVnd: number;
  benefits?: string;
  isActive: boolean;
}

export interface MembershipCardDTO {
  id: number;
  patientId: number;
  tierId: number;
  tier: MembershipTierDTO;
  cardNumber: string;
  totalPoints: number;
  availablePoints: number;
  issuedDate: string;
  expiresDate?: string;
  isActive: boolean;
}

export interface PointTransactionDTO {
  id: number;
  transactionType: string;
  points: number;
  invoiceId?: number;
  note?: string;
  createdAt: string;
}

export interface FeedbackDTO {
  id: number;
  customerName: string;
  role?: string;
  content: string;
  avatarUrl?: string;
  videoUrl?: string;
  rating: number;
  isHighlighted: boolean;
}

export interface CustomerTagDTO {
  id: number;
  name: string;
  color?: string;
  description?: string;
  patientCount: number;
}

export interface NewsDTO {
  id: number;
  title: string;
  slug: string;
  content: string;
  category?: string;
  thumbnail?: string;
  publishDate: string;
  isPublished: boolean;
}
