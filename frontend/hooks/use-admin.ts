import { useAccount } from "wagmi"
import { ADMIN_WALLET } from "@/lib/store"

export function useAdmin() {
  const { address } = useAccount()

  const isAdmin = address?.toLowerCase() === ADMIN_WALLET.toLowerCase()

  return { isAdmin, adminAddress: ADMIN_WALLET }
}
