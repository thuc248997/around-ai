import { GetServerSideProps } from "next"
import AdminLayout from "@components/admin/AdminLayout"
import PostEditor from "@components/admin/PostEditor"
import { requireAdminPage } from "@libs/server/auth"

export const getServerSideProps: GetServerSideProps = async (ctx) => requireAdminPage(ctx) ?? { props: {} }

export default function NewPost() {
  return (
    <AdminLayout title="New post">
      <PostEditor />
    </AdminLayout>
  )
}
