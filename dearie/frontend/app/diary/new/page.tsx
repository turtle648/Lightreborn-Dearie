import { AppLayout } from "@/components/app-layout"
import { DiaryForm } from "@/components/diary-form"

export default function NewDiaryPage() {
  return (
    <AppLayout showBack title="일기 작성" showBottomNav={false}>
      <DiaryForm />
    </AppLayout>
  )
}
