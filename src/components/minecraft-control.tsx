import React, { useState } from "react";
import { useClient } from "@/helpers/use-client";
import { IDroplet } from "dots-wrapper/dist/modules/droplet";
import { Button, Label } from "rbx";
import { SpinUpModal } from "./spin-up-modal";
import useSWR from "swr";

export const MinecraftControl = () => {
  const client = useClient();
  const fetcher = async (path: string) => {
    const { data } = await client!.get(path)
    return data
  }
  const { data: droplet } = useSWR<IDroplet>(client ? '/droplet' : null, fetcher, { refreshInterval: 1000 })
  const [processing, setProcessing] = useState<'up' | 'down'>()

  if (processing == 'up') return <SpinUpModal done={() => setProcessing(undefined)}/>

  if (!droplet) return <Button.Group>
    <Label style={{ marginRight: 20 }}>🔴  Server inactive</Label>
    <Button onClick={() => setProcessing('up')}>Activate Server</Button>
  </Button.Group>

  if (droplet.status == 'new') return <Button.Group>
    <Label style={{ marginRight: 20 }}>🟡  Server spinning up</Label>
    <Button>Deactivate Server</Button>
  </Button.Group>

  return <Button.Group>
    <Label style={{ marginRight: 20 }}>🟢  Server active</Label>
    <Button>Deactivate Server</Button>
  </Button.Group>
}
