import { Authentication } from "./authentication";
import { HttpHandler } from "./http-handler";

import { Ticket } from "@/types/grispi.type";

export class Tickets {
  constructor(
    private http: HttpHandler,
    private auth: Authentication
  ) {}

  async getTicket(ticketKey: string) {
    const response = await this.http.send<Ticket>(
      `public/v1/tickets/${ticketKey}`,
      {
        method: "GET",
        cache: "no-cache",
        headers: this.auth.headers,
      }
    );

    return response;
  }
}
