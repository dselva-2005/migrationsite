import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ImageIcon, VideoIcon, Paperclip } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { CompanyReview } from "@/types/review"

function normalizeType(type?: string) {
    if (!type) return "unknown"
    const t = type.toLowerCase()

    if (t.includes("image")) return "image"
    if (t.includes("video")) return "video"

    return "unknown"
}

export function MediaCell({
    media,
}: {
    media?: CompanyReview["media"]
}) {
    const items = media ?? []
    if (!items.length) {
        return <span className="text-muted-foreground">—</span>
    }

    const imageCount = items.filter(
        m => normalizeType(m.media_type) === "image"
    ).length

    const videoCount = items.filter(
        m => normalizeType(m.media_type) === "video"
    ).length

    const totalCount = items.length

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
                    title="View media"
                >
                    {/* Image count */}
                    {imageCount > 0 && (
                        <span className="flex items-center gap-1">
                            <ImageIcon size={14} />
                            {imageCount}
                        </span>
                    )}

                    {/* Video count */}
                    {videoCount > 0 && (
                        <span className="flex items-center gap-1">
                            <VideoIcon size={14} />
                            {videoCount}
                        </span>
                    )}

                    {/* Fallback: unknown / mixed */}
                    {imageCount === 0 && videoCount === 0 && (
                        <span className="flex items-center gap-1">
                            <Paperclip size={14} />
                            {totalCount}
                        </span>
                    )}
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        <VisuallyHidden>Review media</VisuallyHidden>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3">
                    {items.map(m => {
                        const type = normalizeType(m.media_type)

                        return (
                            <div
                                key={m.id}
                                className="rounded-md overflow-hidden border bg-black"
                            >
                                {type === "image" ? (
                                    <Image
                                        src={m.url}
                                        alt="Review media"
                                        width={600}
                                        height={600}
                                        className="object-cover w-full h-full"
                                        unoptimized
                                    />
                                ) : (
                                    <video
                                        src={m.url}
                                        controls
                                        className="w-full h-full max-h-[320px]"
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}
