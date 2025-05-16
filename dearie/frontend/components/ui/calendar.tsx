"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  // 오늘 날짜 설정
  const today = new Date();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-primary-dark",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-primary/30 hover:bg-primary/10 hover:border-primary/70 text-primary-dark"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",

        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell:
          "text-primary-dark rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center",

        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative flex-1 focus-within:relative focus-within:z-20",

        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 mx-auto hover:bg-primary/20 hover:text-primary-dark focus:ring-primary focus-visible:ring-primary focus:ring-offset-0"
        ),
        day_selected:
          "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white ring-primary",
        day_today:
          "border border-primary bg-primary/10 text-primary-dark font-semibold",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-primary/50 aria-selected:text-white",
        day_hidden: "invisible",

        weekdays: "flex w-full justify-between",
        weekday: "flex-1 text-center text-sm font-medium text-primary/70",

        ...classNames,
      }}
      modifiersClassNames={{
        today: "rdp-day-today-custom",
        selected: "rdp-day-selected-custom",
      }}
      // 명시적으로 오늘 날짜 설정
      modifiers={{ today: today }}
      // 오늘 날짜 스타일 지정
      modifiersStyles={{
        today: {
          fontWeight: "bold",
          border: "1px solid #f1b29f",
          backgroundColor: "rgba(241, 178, 159, 0.1)",
          color: "#e89a84",
        },
        selected: {
          backgroundColor: "#f1b29f",
          color: "white",
          fontWeight: "bold",
        },
      }}
      // 모든 props 전달
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
