import AdminDepositCards from "@/components/AdminDepositCards";
import AdminTradeCards from "@/components/AdminTradesCard";
import AdminUserCards from "@/components/AdminUserCards";
import AdminWithdrawalCards from "@/components/AdminWithdrawalCards";

export default function Admin() {
  return (
    <>
    <AdminUserCards />
    <AdminDepositCards />
    <AdminWithdrawalCards />
    <AdminTradeCards />

      <div className="w-full flex gap-5 my-4 max-[1100px]:flex-col mb-4">
      </div>
    </>
  )
}
