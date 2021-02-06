import { useClient } from "@/helpers/use-client"
import { ProcessorState, ProcessorStepState, Processor } from "@/services/processor"
import { Progress, Title } from "rbx"
import { FC, useEffect, useState } from "react"
import styles from '../styles/processor.module.css'

type SpinUpModalProps = {
  direction: 'up' | 'down'
  done: () => void
}

const iconFor = (state: ProcessorStepState) => {
  switch (state) {
    case ProcessorStepState.Pending:
      return <span className={styles[ProcessorStepState[state]]}>⏸</span>
    case ProcessorStepState.InProgress:
      return <span className={styles[ProcessorStepState[state]]}>✴️</span>
    case ProcessorStepState.Done:
      return <span className={styles[ProcessorStepState[state]]}>✅</span>
    case ProcessorStepState.Error:
      return <span className={styles[ProcessorStepState[state]]}>🆘</span>
  }
}

export const Spinner: FC<SpinUpModalProps> = ({ direction, done }) => {
  const [state, setState] = useState<ProcessorState>()
  const client = useClient()
  const processor = direction === 'up' ? Processor.spinUp : Processor.spinDown

  useEffect(() => {
    if (!client) return
    let mounted = true

    window.onbeforeunload = () => true

    processor(client, s => {
      if (mounted) setState(s)
    })
      .run()
      .then(() => {
        window.onbeforeunload = null
        done()
      })
      .catch()

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
        { state === ProcessorStepState.Error &&
          <p className="has-text-danger is-size-6">Something went wrong... try again</p>
        }
      </Title>
    ))
  } </>
}
