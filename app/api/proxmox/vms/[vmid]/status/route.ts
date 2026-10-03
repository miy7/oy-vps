import { apiError, getAuthorized, parseVmId, proxmox } from "@/lib/proxmox"

type Context = { params: Promise<{ vmid: string }> }

export async function GET(_request: Request, { params }: Context) {
  try {
    const { vmid } = await params
    return Response.json(await getAuthorized(() => proxmox.getVmStatus(parseVmId(vmid))))
  } catch (error) {
    return apiError(error)
  }
}
