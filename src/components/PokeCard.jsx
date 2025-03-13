import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"

export function PokeCard(props) {
    const { selectedPokemon } = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    const {name, height, abilities, stats, types, moves, sprites} = data || {}

    useEffect(() => {
        // if loading, exit logic
        if (loading || !localStorage) {return}

        // check if the selected pokemon info is available in the cache
        // 1. define the cache
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        // 2. check if pokemon is in cache otherwise fetch from api
        if (selectedPokemon in cache) {
            setData(cache[selectedPokemon])
            return
        }

        // save api info to cache if not already
        async function fetchPokiData() {
            setLoading(true)
            try {
                const url = 'https://pokeapi.co/api/v2/' + 'pokemon/' + getPokedexNumber(selectedPokemon)
                const res = await fetch(url)
                const pokiData = await res.json()
                setData(pokiData)

                cache[selectedPokemon] = pokiData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch(err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokiData()

    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <div>
                <h4>Currently Loading!</h4>
            </div>
        )
    }

    return (
        <div className = 'poke-card'>
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)} </h4>
                <h2> {name} </h2>
            </div>
            
        </div>
    )
}