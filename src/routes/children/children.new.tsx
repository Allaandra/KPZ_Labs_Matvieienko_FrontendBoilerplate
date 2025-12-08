import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/children/children/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/children/children/new"!</div>
}
