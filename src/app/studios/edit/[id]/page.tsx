import { redirect } from "next/navigation";

export default async function EditStudioAlias({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/edit-studio/${id}`);
}
