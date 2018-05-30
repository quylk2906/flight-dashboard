export interface TicketPrice  {
   ticketPriceCode: string,
   airlineAgentId: string,
   ticketClassId: string,
   flightScheduleId: string,
   adultPrice: number,
   kidPrice: number,
   adultTax:number,
   kidTax: number,
   id: string,
   createdAt: string,
   updatedAt: string
 }