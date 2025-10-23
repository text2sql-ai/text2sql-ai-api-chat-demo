import Header from '@/components/header'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="h-screen overflow-hidden">
      <Header />
      <Outlet />
    </div>
  ),
})
