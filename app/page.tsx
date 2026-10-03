import { ArrowUpRight, Cpu, HardDrive, LifeBuoy, Network, Server, ShieldCheck, Zap } from "lucide-react"

const stats = [
  { label: "Active instances", value: "12", detail: "+2 this month", icon: Server },
  { label: "Compute usage", value: "38%", detail: "Across 3 nodes", icon: Cpu },
  { label: "Storage used", value: "214 GB", detail: "of 1.5 TB available", icon: HardDrive },
]

const instances = [
  { name: "edge-prod-01", plan: "Performance 4", location: "Amsterdam", status: "Running", ip: "185.92.14.20" },
  { name: "api-staging", plan: "Balanced 2", location: "Frankfurt", status: "Running", ip: "185.92.14.21" },
  { name: "worker-lab", plan: "Compute 2", location: "Helsinki", status: "Stopped", ip: "185.92.14.22" },
]

export default function Home() {
  return (
    <main className="min-h-screen grid-bg">
      <header className="border-b border-[var(--line)] bg-[var(--background)]/90 px-6 py-5 backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded-lg bg-[var(--accent)] text-black"><Zap size={17} fill="currentColor" /></div><span className="text-sm font-bold tracking-[0.22em]">OY / VPS</span></div>
          <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex"><a className="text-white" href="#overview">Overview</a><a href="#instances">Instances</a><a href="#support">Support</a></nav>
          <div className="flex items-center gap-3"><button className="hidden text-sm text-[var(--muted)] sm:block">Account</button><button className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold">Demo mode</button></div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16">
        <section id="overview" className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Control plane / 01</p><h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Your infrastructure,<br /><span className="text-[var(--muted)]">under control.</span></h1><p className="mt-5 max-w-lg text-base leading-7 text-[var(--muted)]">Provision, monitor, and scale reliable VPS instances from one focused workspace.</p></div><button className="flex w-fit items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black">Deploy instance <ArrowUpRight size={16} /></button></section>
        <section className="grid gap-4 md:grid-cols-3">{stats.map(({ label, value, detail, icon: Icon }) => <div key={label} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5"><div className="mb-8 flex items-center justify-between"><span className="text-sm text-[var(--muted)]">{label}</span><Icon size={17} className="text-[var(--accent)]" /></div><div className="text-3xl font-semibold tracking-tight">{value}</div><div className="mt-2 text-xs text-[var(--muted)]">{detail}</div></div>)}</section>
        <section id="instances" className="mt-12 rounded-2xl border border-[var(--line)] bg-[var(--panel)]"><div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-5"><div><h2 className="font-semibold">Your instances</h2><p className="mt-1 text-xs text-[var(--muted)]">All environments, one view.</p></div><button className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold">View all</button></div><div className="divide-y divide-[var(--line)]">{instances.map((instance) => <div key={instance.name} className="grid gap-4 px-5 py-5 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center"><div><div className="flex items-center gap-2 font-medium"><span className={`size-2 rounded-full ${instance.status === "Running" ? "bg-[var(--accent)]" : "bg-[var(--muted)]"}`} />{instance.name}</div><p className="mt-1 pl-4 text-xs text-[var(--muted)]">{instance.ip}</p></div><div><p className="text-xs text-[var(--muted)]">Plan</p><p className="mt-1 text-sm">{instance.plan}</p></div><div><p className="text-xs text-[var(--muted)]">Location</p><p className="mt-1 text-sm">{instance.location}</p></div><div className="flex items-center gap-3"><span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">{instance.status}</span><ArrowUpRight size={16} className="text-[var(--muted)]" /></div></div>)}</div></section>
        <section id="support" className="mt-4 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6"><Network className="mb-6 text-[var(--accent)]" size={20} /><h3 className="text-lg font-semibold">Built for your edge</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Predictable compute, fast networking, and clear visibility when it matters.</p></div><div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6"><LifeBuoy className="mb-6 text-[var(--accent)]" size={20} /><h3 className="text-lg font-semibold">Need a hand?</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Our support team is close to the infrastructure, not hidden behind a ticket maze.</p></div></section>
      </div>
      <footer className="mx-auto flex max-w-7xl items-center justify-between border-t border-[var(--line)] px-6 py-8 text-xs text-[var(--muted)] md:px-10"><span>© 2026 OY VPS</span><span className="flex items-center gap-2"><ShieldCheck size={14} /> Systems operational</span></footer>
    </main>
  )
}
