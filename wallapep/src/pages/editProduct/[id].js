import { useRouter } from "next/router";
import EditProductFormComponent from "../components/products/EditProductFormComponent";

export default function EditProductPage({ openNotification }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <EditProductFormComponent id = {id} openNotification={openNotification} />
    </div>
  );
}
