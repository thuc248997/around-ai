import { GetServerSideProps } from "next"
import AdminLayout from "@components/admin/AdminLayout"
import PostEditor from "@components/admin/PostEditor"
import { requireAdminPage } from "@libs/server/auth"
import { prisma } from "@libs/server/db"
import { serializeAttachment, serializePostDetail } from "@libs/server/posts"
import { TAttachment, TPostDetail } from "@customTypes/index"

type Props = { post: TPostDetail; attachments: TAttachment[] }

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const redirect = requireAdminPage(ctx)
  if (redirect) return redirect
  const post = await prisma.post.findUnique({
    where: { id: String(ctx.params?.id) },
    include: { attachments: { orderBy: { createdAt: "desc" } } },
  })
  if (!post) return { notFound: true }
  return {
    props: {
      post: serializePostDetail(post),
      attachments: post.attachments.map(serializeAttachment),
    },
  }
}

export default function EditPost({ post, attachments }: Props) {
  return (
    <AdminLayout title="Edit post">
      {/* key resets editor state when navigating between posts */}
      <PostEditor key={post.id} post={post} attachments={attachments} />
    </AdminLayout>
  )
}
