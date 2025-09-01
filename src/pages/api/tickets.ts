import type { NextApiRequest, NextApiResponse } from "next";
import { Ticket } from "@/types";
import ticketsDataJson from "@/data/tickets.json";

const ticketsData = ticketsDataJson as Ticket[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ticket[]>
) {

  await new Promise(resolve => setTimeout(resolve, 500)); 
  res.status(200).json(ticketsData);
};