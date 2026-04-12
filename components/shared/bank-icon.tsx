import { PAYMENT_MODES } from "@/config"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const iconMap = Object.fromEntries(
  PAYMENT_MODES.map((p) => [
    p.value,
    { logoUrl: p.logoUrl, fallbackText: p.fallback },
  ])
)

export function BankIcon({
  mode,
  size = "medium",
}: {
  mode: string
  size?: "small" | "medium"
}) {
  const sizeClassName =
    size === "medium" ? "size-8 rounded-sm" : "size-5 rounded-sm"

  const icon = iconMap[mode] ?? {
    logoUrl: "",
    fallbackText: mode.slice(0, 2).toUpperCase(),
  }

  return (
    <Avatar className={sizeClassName}>
      <AvatarImage src={icon.logoUrl} className={sizeClassName} />
      <AvatarFallback className="text-xs">{icon.fallbackText}</AvatarFallback>
    </Avatar>
  )
}
