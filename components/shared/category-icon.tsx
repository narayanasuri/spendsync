import { CategoryEnum } from "@/lib/enums"
import {
  CarIcon,
  CircleQuestionMarkIcon,
  FilmIcon,
  HandHelpingIcon,
  HeartPlusIcon,
  MilkIcon,
  PizzaIcon,
  ScooterIcon,
  ShoppingCartIcon,
} from "lucide-react"

function Icon({ category, size }: { category: CategoryEnum; size: number }) {
  switch (category) {
    case CategoryEnum.DINEOUT:
      return <PizzaIcon size={size} />
    case CategoryEnum.TAKEOUT:
      return <ScooterIcon size={size} />
    case CategoryEnum.ENTERTAINMENT:
      return <FilmIcon size={size} />
    case CategoryEnum.GROCERIES:
      return <MilkIcon size={size} />
    case CategoryEnum.HEALTH:
      return <HeartPlusIcon size={size} />
    case CategoryEnum.SERVICES:
      return <HandHelpingIcon size={size} />
    case CategoryEnum.SHOPPING:
      return <ShoppingCartIcon size={size} />
    case CategoryEnum.TRANSPORT:
      return <CarIcon size={size} />
    default:
      return <CircleQuestionMarkIcon size={size} />
  }
}

export function CategoryIcon({
  category,
  onlyIcon = true,
}: {
  category: CategoryEnum
  onlyIcon?: boolean
}) {
  if (onlyIcon) return <Icon category={category} size={24} />

  return (
    <div className="flex size-8 items-center justify-center rounded-sm bg-muted">
      <Icon category={category} size={16} />
    </div>
  )
}
