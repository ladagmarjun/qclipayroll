import React, { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CardDetailProps {
  title: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
  children?: ReactNode // For content inside the card
}

export default function CardDetail({
  title,
  description,
  buttonText,
  onButtonClick,
  children,
}: CardDetailProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {buttonText && onButtonClick && (
          <Button onClick={onButtonClick}>{buttonText}</Button>
        )}
      </CardHeader>

      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}