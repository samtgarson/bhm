import React, { useState } from "react";
import { useClient } from "@/helpers/use-client";
import { IDroplet } from "dots-wrapper/dist/modules/droplet";
import { Button, Label } from "rbx";
import { Spinner } from "./spinner";
import useSWR from "swr";

export const MinecraftControl = () => {
  const client = useClient()
  const [ finishingUp, setFinishingUp ] = useState(false);
  const fetcher = async (path: string) => {
    const { data } = await client!.get(path)
    return data
  }
  const { data: droplet, mutate, isValidating,  } = useSWR<IDroplet>(client ? '/droplet' : null, fetcher, {
    refreshInterval: 15000,
    errorRetryInterval: 15000,
    isPaused() { return !!processing }
  })
  const [processing, setProcessing] = useState<'up' | 'down'>()

  if (processing) return <Spinner direction={processing} done={async () => {
    setProcessing(undefined)
    setFinishingUp(true)
    await mutate()
    setFinishingUp(false)
  }}/>

  if (finishingUp) return <Label style={{ marginRight: 20 }}><span style={{ marginRight: 10 }}>🟡</span> Finishing up...</Label>

  if (!droplet) return <Button.Group>
    <Label style={{ marginRight: 20 }}><span style={{ marginRight: 10 }}>🔴</span> Server inactive</Label>
    <Button state={isValidating ? 'loading' : undefined } onClick={() => setProcessing('up')}>Activate Server</Button>
  </Button.Group>

  if (droplet.status == 'new') return <Button.Group>
    <Label style={{ marginRight: 20 }}><span style={{ marginRight: 10 }}>🟡</span> Server spinning up</Label>
  </Button.Group>

  return <Button.Group>
    <Label style={{ marginRight: 20 }}><span style={{ marginRight: 10 }}>🟢</span> Server active</Label>
    <Button state={isValidating ? 'loading' : undefined } onClick={() => setProcessing('down')}>Deactivate Server</Button>
  </Button.Group>
}
