import BookingForm from '../../../components/BookingForm'

export default async function Page({ params }: { params: Promise<{ doctorId: string }> }) {
  const { doctorId } = await params
  return <BookingForm doctorId={doctorId} />
}
