"use client";

import { useReservation } from "./ReservationContext";
import Image from "next/image";
import { differenceInDays } from "date-fns";
import { createBooking } from "@/app/_lib/actions";
import SubmitButton from "@/app/_components/SubmitButton";
import { useEffect, useState } from "react";

function ReservationForm({ cabin, user }) {
  const { resetRange, startDate, endDate, numNights, submitButtonDisabled } =
    useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;

  const cabinPrice = numNights > 0 ? numNights * (regularPrice - discount) : 0;

  const [bookingData, setBookingData] = useState({
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
  });

  useEffect(() => {
    setBookingData({
      startDate,
      endDate,
      numNights,
      cabinPrice,
      cabinId: id,
    });
  }, [startDate, endDate, numNights, cabinPrice, id]);

  // const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          {" "}
          <img
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user?.image}
            alt={user?.name}
          />
          <p>{user?.name}</p>
        </div>
      </div>

      <form
        action={async (formData) => {
          await createBooking(bookingData, formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="selectNumberOfGuestDropdown">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <p className="text-primary-300 text-base">Start by selecting dates</p>

          <SubmitButton
            disabled={submitButtonDisabled}
            pendingLabel="Reserving..."
          >
            Reserve now
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
