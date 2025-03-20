import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import TypeCard from './TypeCard'

export default function PokeCard(props) {
    const { selectedPokemon } = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

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
                const url = 'https://pokeapi.co/api/v2/pokemon/' + getPokedexNumber(selectedPokemon)
                const res = await fetch(url)
                const pokiData = await res.json()
                setData(pokiData)
                console.log('fetched pokemon data')

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
                <h4>Loading ...</h4>
            </div>
        )
    }

    const {name, height, abilities, stats, types, moves, sprites} = data || {}

    const imgList = Object.keys(sprites || {}).filter(val => {
        if (sprites[val] == null) { return false}
        if (val == 'other' || val == 'versions') { return false}
        //if (['versions', 'other'].includes(val)) {return false}
        return true
    })

    return (
        <div className = 'poke-card'>
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)} </h4>
                <h2> {name} </h2>
            </div>

            <div className = 'type-container'>
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type= {typeObj?.type?.name} />
                    )
                })}
            </div>

            <div>
                <img className = 'default-img' src={'/pokemon/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt = {`${name}-large-img`} />
                <div className = 'img-container'>
                    {imgList.map((imgKey, imgInd) => {
                        return (
                            <img key = {imgInd} src = {sprites[imgKey]} alt = {name + imgKey}/>
                        )
                    })}
                </div>
                <div className='stats-card'>
                    {stats.map((val, valInd) => {
                        const {stat, base_stat} = val
                        return (
                            <div key={valInd} className = 'stat-item'>
                                <p>{stat?.name.replaceAll('-', ' ')}:</p>
                                <h4>{base_stat}</h4>
                            </div>
                        )
                    })}
                </div>
                <h3>Moves:</h3>
                <div className = 'pokemon-move-grid'>
                    {moves.map((moveObj, moveInd) => {
                        return (
                            <button className="button-card pokemon-move" key = {moveInd} onClick={() => {}}>
                                <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                            </button>

                            // <div key = {moveInd} className="move-item">
                            //     <p>Move #{moveInd}: {moveObj?.move?.name.replaceAll('-', ' ')}</p>
                            // </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}