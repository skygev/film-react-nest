export interface OrderTicketDto {
  film: string;
  session: string;
  row: number;
  seat: number;
}

export class CreateOrderDto {
  tickets: OrderTicketDto[];
  email: string;
  phone?: string;
}

export interface OrderResultDto extends OrderTicketDto {
  id: string;
  daytime: string;
  price: number;
}
