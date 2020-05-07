import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useFela, StyleProps } from 'react-fela'
import { Translations } from '../types/stopwatch'
import { DefaultButton, PrimaryButton, Text } from '@fluentui/react'
import { DetailsList, IColumn } from '@fluentui/react'
import { Theme } from '../theme'
import { IStyle } from 'fela'

interface StopwatchProps {
  t: Translations
}

const container = (): IStyle => ({
  display: 'flex',
  flexFlow: 'column nowrap',
  height: '100%',
})

const timer = ({ theme }: StyleProps<Theme, {}>) => ({
  width: '100%',
  display: 'block',
  fontSize: '28px',
  fontWeight: 200,
  fill: theme.light.black,
  '@media (prefers-color-scheme: dark)': {
    fill: theme.dark.black,
  },
})

const actionRow = () => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'center',
  padding: '0 .4rem',
  margin: '1rem -.5rem 1rem 0',
  '@media (min-width: 500px)': {
    padding: '0 4rem',
    margin: '2rem -.5rem 2rem 0',
  },
})

const btn = () => ({
  marginRight: '.5rem',
  paddingBottom: '.2rem',
  flex: '1 0 0',
})

const lapList = (): IStyle => ({
  flex: '1 0 0',
  overflowY: 'auto',
})

function renderDigits(time: number) {
  const min = Math.floor(time / 6e4)
    .toString(10)
    .padStart(2, '0')

  const s = (Math.floor(time / 1e3) % 60).toString(10).padStart(2, '0')

  const cs = (Math.floor(time / 10) % 100).toString(10).padStart(2, '0')

  return min + s + cs
}

function Stopwatch({ t }: StopwatchProps) {
  const { css } = useFela<Theme, {}>({})

  const timerRef = useRef<SVGSVGElement>(null)
  const animateRef = useRef<number>()

  const totalStartTimeRef = useRef<number>(0)
  const totalOffsetRef = useRef<number>(0)
  const totalRef = useRef<number>(0)

  const lapStartTimeRef = useRef<number>(0)
  const lapOffsetRef = useRef<number>(0)

  const [laps, setLaps] = useState<number[]>([])
  const [running, setRunning] = useState<boolean>(false)

  const lapsColumns: IColumn[] = [
    {
      key: 'col1',
      name: t['lap index'],
      ariaLabel: t['lap index label'],
      fieldName: 'lap_index',
      minWidth: 64,
    },
    {
      key: 'col2',
      name: t['lap time'],
      ariaLabel: t['lap time label'],
      fieldName: 'lap_time',
      minWidth: 64,
    },
  ]

  const lapsItems = laps.map((lapTime, i) => {
    const digits = renderDigits(lapTime)
    return {
      lap_index: `${t['lap label']} ${i + 1}`,
      lap_time: [
        digits.slice(0, 2),
        t['separator<min,s>'],
        digits.slice(2, 4),
        t['separator<s,cs>'],
        digits.slice(4, 6),
      ].join(''),
    }
  })

  function updateTimer() {
    if (timerRef && timerRef.current) {
      const digits = renderDigits(totalRef.current)
      const $digits = timerRef.current.children
      $digits[0].textContent = digits[0]
      $digits[1].textContent = digits[1]
      $digits[3].textContent = digits[2]
      $digits[4].textContent = digits[3]
      $digits[6].textContent = digits[4]
      $digits[7].textContent = digits[5]
    }
  }

  const animate = useCallback(() => {
    setRunning((prevRunning) => prevRunning)
    totalRef.current =
      totalOffsetRef.current + Date.now() - totalStartTimeRef.current
    updateTimer()
    if (running) animateRef.current = requestAnimationFrame(animate)
  }, [running])

  useEffect(() => {
    if (running) animateRef.current = requestAnimationFrame(animate)
  }, [animate, running])

  function onClickStartStop() {
    if (running) {
      typeof animateRef.current === 'number' &&
        cancelAnimationFrame(animateRef.current)
      totalOffsetRef.current = totalRef.current
      lapOffsetRef.current = Date.now() - lapStartTimeRef.current
      setRunning(false)
    } else {
      setRunning(true)
      lapStartTimeRef.current = Date.now()
      totalStartTimeRef.current = Date.now()
    }
  }

  function onClickLapReset() {
    if (running) {
      // Lap
      setLaps([
        ...laps,
        lapOffsetRef.current + Date.now() - lapStartTimeRef.current,
      ])
      lapStartTimeRef.current = Date.now()
      lapOffsetRef.current = 0
    } else if (totalOffsetRef.current > 0) {
      // Reset
      totalRef.current = 0
      totalOffsetRef.current = 0
      lapOffsetRef.current = 0
      setLaps([])
      updateTimer()
    }
  }

  return (
    <section className={css(container)}>
      <svg
        viewBox="0 0 116 30"
        className={css(timer)}
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        ref={timerRef}
      >
        <text x="8.5" y="28" textLength="17" textAnchor="middle">
          0
        </text>
        <text x="25.5" y="28" textLength="17" textAnchor="middle">
          0
        </text>
        <text x="37.5" y="28" textLength="7" textAnchor="middle">
          {t['separator<min,s>']}
        </text>
        <text x="49.5" y="28" textLength="17" textAnchor="middle">
          0
        </text>
        <text x="66.5" y="28" textLength="17" textAnchor="middle">
          0
        </text>
        <text x="78.5" y="28" textLength="7" textAnchor="middle">
          {t['separator<s,cs>']}
        </text>
        <text x="90.5" y="28" textLength="17" textAnchor="middle">
          0
        </text>
        <text x="107.5" y="28" textLength="17" textAnchor="middle">
          0
        </text>
      </svg>
      <div className={css(actionRow)}>
        <DefaultButton
          className={css(btn)}
          onClick={onClickLapReset}
          disabled={!(running || totalOffsetRef.current > 0)}
        >
          <Text variant="large">
            {running
              ? t['lap']
              : totalOffsetRef.current > 0
              ? t['reset']
              : t['lap']}
          </Text>
        </DefaultButton>
        <PrimaryButton className={css(btn)} onClick={onClickStartStop}>
          <Text variant="large">
            {running
              ? t['pause']
              : totalOffsetRef.current > 0
              ? t['resume']
              : t['start']}
          </Text>
        </PrimaryButton>
      </div>
      <div className={css(lapList)} data-is-scrollable={true}>
        <DetailsList
          columns={lapsColumns}
          items={lapsItems}
          selectionMode={0}
        />
      </div>
    </section>
  )
}

export default Stopwatch
