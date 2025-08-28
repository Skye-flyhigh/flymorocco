import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import VaultDashboard from "./VaultDashboard";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const vaultAuth = cookieStore.get("vault-auth");

  if (!vaultAuth || vaultAuth.value !== "authenticated") {
    redirect("/en/vault");
  }

  return <VaultDashboard />;
}
