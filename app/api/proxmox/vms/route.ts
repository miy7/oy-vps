import { apiError, getAuthorized, proxmox } from "@/lib/proxmox"

export async function GET() {
  try {
    return Response.json(await getAuthorized(() => proxmox.listVms()))
  } catch (error) {
    return apiError(error)
  }
}
