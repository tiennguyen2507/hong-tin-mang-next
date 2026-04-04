import { redirect } from "next/navigation";

/** Đặt hàng đã gộp vào /cart — giữ URL cũ không gãy bookmark. */
export default function CheckoutPage() {
  redirect("/cart");
}
