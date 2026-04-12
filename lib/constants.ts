import { CategoryEnum, PaymentModeEnum, TimeRangeEnum } from "./enums"
import { OptionType } from "./types"

export const CATEGORY_LABEL: Record<CategoryEnum, string> = {
  [CategoryEnum.DINEOUT]: "Dineout",
  [CategoryEnum.TAKEOUT]: "Takeout",
  [CategoryEnum.HEALTH]: "Health",
  [CategoryEnum.GROCERIES]: "Groceries",
  [CategoryEnum.ENTERTAINMENT]: "Entertainment",
  [CategoryEnum.TRANSPORT]: "Transport",
  [CategoryEnum.SHOPPING]: "Shopping",
  [CategoryEnum.SERVICES]: "Services",
  [CategoryEnum.MISC]: "Misc",
}

export const CATEGORY_OPTIONS: OptionType[] = [
  {
    label: CATEGORY_LABEL[CategoryEnum.DINEOUT],
    value: CategoryEnum.DINEOUT,
  },
  {
    label: CATEGORY_LABEL[CategoryEnum.TAKEOUT],
    value: CategoryEnum.TAKEOUT,
  },
  {
    label: CATEGORY_LABEL[CategoryEnum.HEALTH],
    value: CategoryEnum.HEALTH,
  },
  {
    label: CATEGORY_LABEL[CategoryEnum.GROCERIES],
    value: CategoryEnum.GROCERIES,
  },
  {
    label: CATEGORY_LABEL[CategoryEnum.ENTERTAINMENT],
    value: CategoryEnum.ENTERTAINMENT,
  },
  {
    label: CATEGORY_LABEL[CategoryEnum.TRANSPORT],
    value: CategoryEnum.TRANSPORT,
  },
  {
    label: CATEGORY_LABEL[CategoryEnum.SHOPPING],
    value: CategoryEnum.SHOPPING,
  },
  {
    label: CATEGORY_LABEL[CategoryEnum.SERVICES],
    value: CategoryEnum.SERVICES,
  },
  {
    label: CATEGORY_LABEL[CategoryEnum.MISC],
    value: CategoryEnum.MISC,
  },
]

export const PAYMENT_MODE_LABEL: Record<PaymentModeEnum, string> = {
  [PaymentModeEnum.SAVINGS]: "Savings",
  [PaymentModeEnum.ZEN]: "Zen",
  [PaymentModeEnum.NEO]: "Neo",
  [PaymentModeEnum.MYZONE]: "MyZone",
  [PaymentModeEnum.AMAZON]: "Amazon",
  [PaymentModeEnum.LEGEND]: "Legend",
}

export const PAYMENT_MODE_OPTIONS: OptionType[] = [
  {
    label: PAYMENT_MODE_LABEL[PaymentModeEnum.SAVINGS],
    value: PaymentModeEnum.SAVINGS,
  },
  {
    label: PAYMENT_MODE_LABEL[PaymentModeEnum.ZEN],
    value: PaymentModeEnum.ZEN,
  },
  {
    label: PAYMENT_MODE_LABEL[PaymentModeEnum.NEO],
    value: PaymentModeEnum.NEO,
  },
  {
    label: PAYMENT_MODE_LABEL[PaymentModeEnum.MYZONE],
    value: PaymentModeEnum.MYZONE,
  },
  {
    label: PAYMENT_MODE_LABEL[PaymentModeEnum.AMAZON],
    value: PaymentModeEnum.AMAZON,
  },
  {
    label: PAYMENT_MODE_LABEL[PaymentModeEnum.LEGEND],
    value: PaymentModeEnum.LEGEND,
  },
]

export const BUDGET_LIMITS: Partial<Record<CategoryEnum, number>> = {
  [CategoryEnum.DINEOUT]: 6000,
  [CategoryEnum.SHOPPING]: 5000,
  [CategoryEnum.TRANSPORT]: 2000,
  [CategoryEnum.TAKEOUT]: 4000,
}

export const CARD_LIMITS: Partial<Record<PaymentModeEnum, number>> = {
  [PaymentModeEnum.ZEN]: 236000,
  [PaymentModeEnum.NEO]: 40000,
  [PaymentModeEnum.MYZONE]: 40000,
  [PaymentModeEnum.AMAZON]: 350000,
  [PaymentModeEnum.LEGEND]: 75000,
}

export const TIME_RANGE_LABEL: Record<TimeRangeEnum, string> = {
  [TimeRangeEnum.THIS_WEEK]: "This Week",
  [TimeRangeEnum.THIS_MONTH]: "This Month",
  [TimeRangeEnum.PAST_WEEK]: "Past Week",
  [TimeRangeEnum.PAST_MONTH]: "Past Month",
}

export const TIME_RANGE_OPTIONS: OptionType[] = [
  {
    label: TIME_RANGE_LABEL[TimeRangeEnum.THIS_WEEK],
    value: TimeRangeEnum.THIS_WEEK,
  },
  {
    label: TIME_RANGE_LABEL[TimeRangeEnum.THIS_MONTH],
    value: TimeRangeEnum.THIS_MONTH,
  },
  {
    label: TIME_RANGE_LABEL[TimeRangeEnum.PAST_WEEK],
    value: TimeRangeEnum.PAST_WEEK,
  },
  {
    label: TIME_RANGE_LABEL[TimeRangeEnum.PAST_MONTH],
    value: TimeRangeEnum.PAST_MONTH,
  },
]
