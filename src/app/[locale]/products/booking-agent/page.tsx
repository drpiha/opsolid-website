import type { Metadata } from "next";
import { BookingAgentPage } from "./BookingAgentPage";

export const metadata: Metadata = {
  title: "Appointment Booking Agent · OpSolid",
  description:
    "Booking via voice, chat, or form — with live Cal.com / Google Calendar sync. No double-bookings.",
};

export default function Page() {
  return <BookingAgentPage />;
}
