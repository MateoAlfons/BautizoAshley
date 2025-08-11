"use client"

import * as React from "react"
import useEmblaCarousel, { type EmblaCarouselType } from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselOptions = NonNullable<React.ComponentProps<typeof useEmblaCarousel>[0]>
type CarouselPlugin = NonNullable<React.ComponentProps<typeof useEmblaCarousel>[1]>

interface CarouselProps {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: EmblaCarouselType) => void
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ opts, plugins, orientation = "horizontal", setApi, children, className, contentClassName, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: EmblaCarouselType) => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    React.useEffect(() => {
      if (!emblaApi) {
        return
      }

      setApi?.(emblaApi)
      onSelect(emblaApi)
      emblaApi.on("reInit", onSelect)
      emblaApi.on("select", onSelect)

      return () => {
        emblaApi.off("reInit", onSelect)
        emblaApi.off("select", onSelect)
      }
    }, [emblaApi, onSelect, setApi])

    return (
      <div ref={ref} className={cn("relative", className)} role="region" aria-roledescription="carousel" {...props}>
        <div ref={emblaRef} className="overflow-hidden">
          <div className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", contentClassName)}>
            {children}
          </div>
        </div>
        <CarouselPrevious onClick={() => emblaApi?.scrollPrev()} disabled={!canScrollPrev} />
        <CarouselNext onClick={() => emblaApi?.scrollNext()} disabled={!canScrollNext} />
      </div>
    )
  },
)
Carousel.displayName = "Carousel"

interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ orientation = "horizontal", className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
      {...props}
    />
  ),
)
CarouselItem.displayName = "CarouselItem"

interface CarouselButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  orientation?: "horizontal" | "vertical"
}

export const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselButtonProps>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("absolute h-8 w-8 rounded-full", "left-4 top-1/2 -translate-y-1/2", className)}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  ),
)
CarouselPrevious.displayName = "CarouselPrevious"

export const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselButtonProps>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("absolute h-8 w-8 rounded-full", "right-4 top-1/2 -translate-y-1/2", className)}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  ),
)
CarouselNext.displayName = "CarouselNext"

export const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn("flex", className)} ref={ref} {...props} />,
)
CarouselContent.displayName = "CarouselContent"
