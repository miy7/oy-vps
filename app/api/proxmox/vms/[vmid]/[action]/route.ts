import { apiError, parseVmId, performVmAction } from "@/lib/proxmox"

type Context = { params: Promise<{ vmid: string; action: string }> }

export async function POST(_request: Request, { params }: Context) {
  try {
    const { vmid, action } = await params
    return Response.json({ task: await performVmAction(parseVmId(vmid), action) })
  } catch (error) {
    return apiError(error)
  }
}
