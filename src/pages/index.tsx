import { useAuth0 } from "@auth0/auth0-react";
import {  Button, Title } from "rbx";
import React from "react";
import { MinecraftControl } from "@/components/minecraft-control";
import blockStyles from '@/styles/block.module.css'

const Content = () => <>
  <div className={blockStyles.block}>
    <Title size={4}>Minecraft</Title>
    <MinecraftControl />
  </div>
</>

export default function Home() {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0()
  if (isLoading) return null
    if (!isAuthenticated) return <Button onClick={() => loginWithRedirect()}>Log In</Button>

  return <Content />
}
