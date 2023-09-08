import { Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container'

export default function Layout() {
  return (
    <Container>
        <Outlet />
    </Container>
  )
}
