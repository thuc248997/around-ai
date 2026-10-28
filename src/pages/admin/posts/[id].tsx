import { GetServerSideProps } from "next"
import AdminLayout from "@components/admin/AdminLayout"
import PostEditor from "@components/admin/PostEditor"
import { requireAdminPage } from "@libs/server/auth"
import { prisma } from "@libs/server/db"
import { findTranslation } from "@libs/server/postPair"
import { isTranslationSlug, serializeAttachment, serializePostDetail } from "@libs/server/posts"
import { VI_SUFFIX } from "@libs/i18n"
import { TAttachment, TPostDetail } from "@customTypes/index"

type Props = { post: TPostDetail; translation: TPostDetail | null; attachments: TAttachment[] }

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const redirect = requireAdminPage(ctx)
  if (redirect) return redirect
  const post = await prisma.post.findUnique({
    where: { id: String(ctx.params?.id) },
    include: { attachments: { orderBy: { createdAt: "desc" } } },
  })
  if (!post) return { notFound: true }

  // translations are edited side by side with their English post
  if (isTranslationSlug(post.slug)) {
    const original = await prisma.post.findUnique({
      where: { slug: post.slug.slice(0, -VI_SUFFIX.length) },
      select: { id: true },
    })
    if (original) return { redirect: { destination: `/admin/posts/${original.id}?lang=vi`, permanent: false } }
  }

  const translation = isTranslationSlug(post.slug) ? null : await findTranslation(post.slug)
  return {
    props: {
      post: serializePostDetail(post),
      translation: translation && serializePostDetail(translation),
      attachments: post.attachments.map(serializeAttachment),
    },
  }
}

export default function EditPost({ post, translation, attachments }: Props) {
  return (
    <AdminLayout title="Edit post">
      {/* key resets editor state when navigating between posts */}
      <PostEditor key={post.id} post={post} translation={translation} attachments={attachments} />
    </AdminLayout>
  )
}
