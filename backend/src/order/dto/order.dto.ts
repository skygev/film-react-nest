export class CreateOrderDto {
  filmId: string;
  sessionId: string;
  ticketsCount: number;
  email: string;
  phone?: string;
}

export class OrderStatusDto {
  orderId: string;
  status: 'processing' | 'confirmed';
  totalPrice: number;
}
