import { useAuth0 } from "@auth0/auth0-react"
import { Title } from "rbx"
import React from "react"

export const AppTitle = () => {
  const { user, logout } = useAuth0()
  return (
    <>
    <Title spaced>🤘 Boarding House Massive</Title>
    { user && <Title as="p" subtitle>Welcome, { user.name }!{' '}<a onClick={() => logout()} href="/#">Log Out</a></Title> }
    </>
  )
}
