import { AppLayout } from "@/components/app-layout"
import { DiaryDetail } from "@/components/diary-detail"
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"

interface DiaryDetailPageProps {
  params: {
    id: string
  }
}

export default async function DiaryDetailPage({ params }: DiaryDetailPageProps) {
  const { id } = params

  return (
    <AppLayout
      showBack
      rightAction={
        <Button variant="ghost" size="icon" className="rounded-full">
          <Share className="h-5 w-5" />
        </Button>
      }
      transparentHeader
    >
      <DiaryDetail id={id} />
    </AppLayout>
  )
}
