"use client";

import { differenceInDays, isSameDay, isWithinInterval } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";

function isAlreadyBooked(range, datesArr) {
  return (
    range?.from &&
    range?.to &&
    datesArr?.some((date) =>
      isWithinInterval(date, { start: range?.from, end: range?.to }),
    )
  );
}

function DateSelector({ settings, cabin, bookedDates }) {
  const { range, setRange, resetRange } = useReservation();

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const { regularPrice, discount } = cabin;

  const numNights = differenceInDays(displayRange?.to, displayRange?.from);
  const cabinPrice =
    numNights > 0 ? numNights * (cabin.regularPrice - cabin.discount) : 0;

  const { minBookingLength, maxBookingLength } = settings;

  const handleSelect = (selectedRange) => {
    if (selectedRange?.from && selectedRange?.to) {
      // Check if the start and end dates are the same
      if (isSameDay(selectedRange.from, selectedRange.to)) {
        // Reset or ignore the selection
        resetRange();
        return;
      }
    }
    if (isAlreadyBooked(selectedRange, bookedDates)) {
      alert("These dates are already booked. Please select different dates.");
      resetRange();
      return;
    }
    setRange(selectedRange);
  };

  return (
    <>
      <div className="flex flex-col justify-between">
        <DayPicker
          className={"pt-12 place-self-center"}
          mode="range"
          onSelect={handleSelect}
          selected={displayRange}
          min={minBookingLength}
          max={maxBookingLength}
          startMonth={new Date()}
          endMonth={
            new Date(new Date().setFullYear(new Date().getFullYear() + 2))
          }
          captionLayout="dropdown"
          numberOfMonths={1}
          disabled={[...bookedDates, { before: new Date() }]}
        />

        <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
          <div className="flex items-baseline gap-6">
            <p className="flex gap-2 items-baseline">
              {discount > 0 ? (
                <>
                  <span className="text-2xl">${regularPrice - discount}</span>
                  <span className="line-through font-semibold text-primary-700">
                    ${regularPrice}
                  </span>
                </>
              ) : (
                <span className="text-2xl">${regularPrice}</span>
              )}
              <span className="">/night</span>
            </p>
            {numNights >= minBookingLength ? (
              <>
                <p className="bg-accent-600 px-3 py-2 text-2xl">
                  <span>&times;</span> <span>{numNights}</span>
                </p>
                <p>
                  <span className="text-lg font-bold uppercase">Total</span>{" "}
                  <span className="text-2xl font-semibold">${cabinPrice}</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-primary-700">
                Minimum stay: {minBookingLength} nights
              </p>
            )}
          </div>

          {range?.from || range?.to ? (
            <button
              className="border border-primary-800 py-2 px-4 text-sm font-semibold"
              onClick={resetRange}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
      <style>
        {`
          .rdp-dropdowns option {
            background-color: rgb(44 61 79 / var(--tw-bg-opacity)) !important;
            color: #fff !important;
            border: 1px solid #ccc !important;
            padding: 5px !important;
            border-radius: 4px !important;
          }
        `}
      </style>
    </>
  );
}

export default DateSelector;
