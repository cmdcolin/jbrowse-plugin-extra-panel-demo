import React, { useState, useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ExtraFeaturePanel(props: any) {
  console.log({ props })
  const [data, setData] = useState()
  const [error, setError] = useState<unknown>()
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      try {
        const result = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
        if (!result.ok) {
          throw new Error(`HTTP ${result.status} fetching pokemon`)
        }
        const d = await result.json()
        setData(d)
      } catch (e) {
        console.error(e)
        setError(e)
      }
    })()
  }, [])
  return error ? (
    <div style={{ color: 'red' }}>{`${error}`}</div>
  ) : data ? (
    <div>
      <h1>Our custom feature panel</h1>
      <div style={{ margin: 10 }}>
        Here is some data about a the feature you clicked in JSON form
        {JSON.stringify(props.feature)}
      </div>

      <div style={{ margin: 10 }}>
        Here is some data about pikachu from the pokemon API{' '}
        {data.moves.map(move => (
          <div key={move.move.name}>name: {move.move.name}</div>
        ))}
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  )
}
