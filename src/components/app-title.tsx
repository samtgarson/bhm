import { useAuth0 } from "@auth0/auth0-react"
import { Button, Level, Title } from "rbx"
import React from "react"

export const AppTitle = () => {
  const { user, logout } = useAuth0()
  return <>
    <Title spaced>Boarding House Massive 🤘</Title>
    { user &&
      <Level>
        <Level.Item align="left">
          <Title as="p" subtitle>Welcome, { user.name }!</Title>
        </Level.Item>
        <Level.Item align="right">
          <Button onClick={() => logout()} href="/#">Log Out</Button>
        </Level.Item>
      </Level>
    }
  </>
}
