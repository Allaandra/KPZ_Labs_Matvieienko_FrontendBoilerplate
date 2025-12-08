import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/children/$childId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/children/$childId"!</div>
}
