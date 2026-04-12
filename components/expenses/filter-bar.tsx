"use client"

import { type DateRange } from "react-day-picker"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ListFilterIcon } from "lucide-react"
import { FilterFields } from "./filter-fields/filter-fields"

export interface FilterBarProps {
  dateRange: DateRange
  setDateRange: (r: DateRange) => void
  category: string
  setCategory: (v: string) => void
  paymentMode: string
  setPaymentMode: (v: string) => void
  onClear: () => void
}

export function FilterBar({
  dateRange,
  setDateRange,
  category,
  setCategory,
  paymentMode,
  setPaymentMode,
  onClear,
}: FilterBarProps) {
  const hasFilters = category !== "all" || paymentMode !== "all"

  return (
    <div className="mb-4">
      {/* Mobile: accordion */}
      <div className="sm:hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="filters" className="border-b-0">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <ListFilterIcon className="size-4" />
                {hasFilters ? "Filters (active)" : "Filters"}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3 pt-1">
                <FilterFields
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  category={category}
                  setCategory={setCategory}
                  paymentMode={paymentMode}
                  setPaymentMode={setPaymentMode}
                  onClear={onClear}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop: flat row */}
      <div className="hidden sm:flex sm:flex-row sm:items-end sm:gap-3">
        <FilterFields
          dateRange={dateRange}
          setDateRange={setDateRange}
          category={category}
          setCategory={setCategory}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          onClear={onClear}
        />
      </div>
    </div>
  )
}
