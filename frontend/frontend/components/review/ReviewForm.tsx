import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrustpilotRating } from "@/components/TrustpilotRating"

interface Props {
  rating: number
}

export function ReviewForm({ rating }: Props) {
  return (
    <div className="mt-8 space-y-6">
      <TrustpilotRating rating={rating} starsize={35} />

      <div className="space-y-2">
        <Label htmlFor="review">
          Tell us about your experience
        </Label>
        <Textarea
          id="review"
          rows={6}
          placeholder="What went well? What didn’t?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">
          Review title
        </Label>
        <Input
          id="title"
          placeholder="Summarize your experience"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">
          Date of experience
        </Label>
        <Input
          id="date"
          type="date"
        />
      </div>

      <Button className="w-full">
        Submit review
      </Button>
    </div>
  )
}
