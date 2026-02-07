export interface OrderTicketDto {
  film: string;
  session: string;
  row: number;
  seat: number;
}

export interface OrderTicketRequestDto extends OrderTicketDto {
  daytime?: string;
  price?: number;
}

export interface OrderTicketsEnvelope {
  tickets: OrderTicketRequestDto[];
  email?: string;
  phone?: string;
}

export type CreateOrderDto = OrderTicketRequestDto[] | OrderTicketsEnvelope;

export interface OrderResultDto extends OrderTicketDto {
  id: string;
  daytime: string;
  price: number;
}
