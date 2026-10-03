type ProxmoxResponse<T> = {
  data: T
  errors?: Record<string, string>
}

export type ProxmoxNode = {
  node: string
  status: string
  cpu: number
  maxcpu: number
  mem: number
  maxmem: number
  uptime: number
}

export type ProxmoxResource = ProxmoxNode & {
  type: string
  id: string
  level?: string
  vmid?: number
  name?: string
  maxdisk?: number
  disk?: number
  template?: boolean
}

export type ProxmoxVmStatus = {
  vmid: number
  name?: string
  status: "running" | "stopped" | string
  qmpstatus?: string
  uptime?: number
  cpu?: number
  mem?: number
  maxmem?: number
  disk?: number
  maxdisk?: number
}

class ProxmoxError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = "ProxmoxError"
  }
}

function getConfig() {
  const baseUrl = process.env.PROXMOX_API_URL?.replace(/\/$/, "")
  const tokenId = process.env.PROXMOX_TOKEN_ID
  const tokenSecret = process.env.PROXMOX_TOKEN_SECRET
  const node = process.env.PROXMOX_NODE

  if (!baseUrl || !tokenId || !tokenSecret || !node) {
    throw new ProxmoxError(503, "Proxmox service is not configured")
  }

  return { baseUrl, tokenId, tokenSecret, node }
}

async function request<T>(path: string, init?: RequestInit) {
  const { baseUrl, tokenId, tokenSecret } = getConfig()
  const response = await fetch(`${baseUrl}/api2/json${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `PVEAPIToken=${tokenId}=${tokenSecret}`,
      ...init?.headers,
    },
    cache: "no-store",
  })

  let body: ProxmoxResponse<T> | undefined
  try {
    body = (await response.json()) as ProxmoxResponse<T>
  } catch {
    throw new ProxmoxError(502, "Proxmox returned an invalid response")
  }

  if (!response.ok || body.errors) {
    throw new ProxmoxError(response.status >= 500 ? 502 : response.status, "Proxmox request failed")
  }

  return body.data
}

export const proxmox = {
  getNode: () => {
    const { node } = getConfig()
    return request<ProxmoxNode>(`/nodes/${encodeURIComponent(node)}/status`)
  },
  getResources: () => {
    const { node } = getConfig()
    return request<ProxmoxResource[]>(`/nodes/${encodeURIComponent(node)}/resources`)
  },
  listVms: async () => {
    const resources = await proxmox.getResources()
    return resources.filter((resource) => resource.type === "qemu" || resource.type === "lxc")
  },
  getVmStatus: (vmid: number) => {
    const { node } = getConfig()
    return request<ProxmoxVmStatus>(`/nodes/${encodeURIComponent(node)}/qemu/${vmid}/status/current`)
  },
  startVm: (vmid: number) => changeVmStatus(vmid, "start"),
  stopVm: (vmid: number) => changeVmStatus(vmid, "stop"),
  restartVm: (vmid: number) => changeVmStatus(vmid, "reboot"),
  shutdownVm: (vmid: number) => changeVmStatus(vmid, "shutdown"),
}

async function changeVmStatus(vmid: number, action: "start" | "stop" | "reboot" | "shutdown") {
  const { node } = getConfig()
  return request<string>(`/nodes/${encodeURIComponent(node)}/qemu/${vmid}/status/${action}`, { method: "POST" })
}

export { ProxmoxError }

export function parseVmId(value: string) {
  const vmid = Number(value)
  if (!Number.isInteger(vmid) || vmid < 1) throw new ProxmoxError(400, "Invalid VM ID")
  return vmid
}

export function isProxmoxError(error: unknown): error is ProxmoxError {
  return error instanceof ProxmoxError
}

export function apiError(error: unknown) {
  if (isProxmoxError(error)) return Response.json({ error: error.message }, { status: error.status })
  return Response.json({ error: "Unexpected Proxmox service error" }, { status: 500 })
}

export function requireVpsAuthorization() {
  throw new ProxmoxError(503, "Authentication is required before VPS operations are enabled")
}

function assertAction(action: string): asserts action is "start" | "stop" | "reboot" | "shutdown" {
  if (!["start", "stop", "reboot", "shutdown"].includes(action)) throw new ProxmoxError(400, "Unsupported VM action")
}

export async function performVmAction(vmid: number, action: string) {
  assertAction(action)
  requireVpsAuthorization()
  return proxmox[`${action === "reboot" ? "restart" : action}Vm` as "startVm" | "stopVm" | "restartVm" | "shutdownVm"](vmid)
}

export async function getAuthorized<T>(operation: () => Promise<T>) {
  requireVpsAuthorization()
  return operation()
}
