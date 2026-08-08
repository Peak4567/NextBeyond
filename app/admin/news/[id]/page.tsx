import { redirect } from "next/navigation";

export default function AdminNewsDetailRedirect({ params }: { params: { id: string } }) {
  redirect(`/admin/news/${params.id}/editor`);
}
