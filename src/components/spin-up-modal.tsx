import { useClient } from "@/helpers/use-client"
import { ProcessorState, ProcessorStepState } from "@/services/processor"
import { Progress, Title } from "rbx"
import { FC, useEffect, useState } from "react"
import styles from '../styles/processor.module.css'
import { SpinUp } from '@/services/spin-up'

type SpinUpModalProps = {
  done: () => void
}

const iconFor = (state: ProcessorStepState) => {
  switch (state) {
    case ProcessorStepState.Pending:
      return <span className={styles[ProcessorStepState[state]]}>⏸</span>
    case ProcessorStepState.InProgress:
      return <span className={styles[ProcessorStepState[state]]}>🔄</span>
    case ProcessorStepState.Done:
      return <span className={styles[ProcessorStepState[state]]}>✅</span>
    case ProcessorStepState.Error:
      return <span className={styles[ProcessorStepState[state]]}>🆘</span>
  }
}

export const SpinUpModal: FC<SpinUpModalProps> = ({ done }) => {
  const [state, setState] = useState<ProcessorState>()
  const client = useClient()

  useEffect(() => {
    if (!client) return
    let mounted = true
    const processor = new SpinUp(client, s => {
      if (mounted) setState(s)
    })

    processor.run().then(done).catch()

    return () => { mounted = false }
  }, [client])

  if (!state) return null
  return <> {
    Object.entries(state).map(([msg, state]) => (
      <Title className={styles.item} size={5} key={msg}>
        {iconFor(state)}
        <span className={styles.label}>{msg}</span>
        { state === ProcessorStepState.InProgress &&
          <Progress color="light" size="small" />
        }
      </Title>
    ))
  } </>
}
