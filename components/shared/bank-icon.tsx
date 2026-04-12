import { PaymentModeEnum } from "@/lib/enums"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const iconMap = {
  [PaymentModeEnum.ZEN]: {
    logoUrl: "/kotak.png",
    fallbackText: "ZN",
  },
  [PaymentModeEnum.AMAZON]: {
    logoUrl: "/icici.png",
    fallbackText: "AM",
  },
  [PaymentModeEnum.NEO]: {
    logoUrl: "/axis.png",
    fallbackText: "NE",
  },
  [PaymentModeEnum.MYZONE]: {
    logoUrl: "/axis.png",
    fallbackText: "MY",
  },
  [PaymentModeEnum.LEGEND]: {
    logoUrl: "/indusind.png",
    fallbackText: "LG",
  },
  [PaymentModeEnum.SAVINGS]: {
    logoUrl: "/phonepe.png",
    fallbackText: "SV",
  },
}

export function BankIcon({
  mode,
  size = "medium",
}: {
  mode: PaymentModeEnum
  size?: "small" | "medium"
}) {
  const sizeClassName =
    size === "medium" ? "size-8 rounded-sm" : "size-5 rounded-sm"

  return (
    <Avatar className={sizeClassName}>
      <AvatarImage src={iconMap[mode].logoUrl} className={sizeClassName} />
      <AvatarFallback className="text-xs">
        {iconMap[mode].fallbackText}
      </AvatarFallback>
    </Avatar>
  )
}
