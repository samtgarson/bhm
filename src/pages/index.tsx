import { useAuth0 } from "@auth0/auth0-react";
import { Section, Container, Button } from "rbx";
import React from "react";
import { AppTitle } from "~/components/app-title";
import { MinecraftControl } from "~/components/minecraft-control";

export default function Home() {
  const { isAuthenticated, loginWithPopup } = useAuth0()
  return (
    <Section>
      <Container>
        <AppTitle />
        { isAuthenticated
          ? <MinecraftControl />
          : <Button onClick={loginWithPopup}>Log In</Button>
        }
      </Container>
    </Section>
  )
}
