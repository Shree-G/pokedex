import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import TypeCard from './TypeCard'
import Modal from "./Modal"

export default function PokeCard(props) {
    const { selectedPokemon } = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)

    const {name, height, abilities, stats, types, moves, sprites} = data || {}

    const imgList = Object.keys(sprites || {}).filter(val => {
        if (sprites[val] == null) { return false}
        if (val == 'other' || val == 'versions') { return false}
        //if (['versions', 'other'].includes(val)) {return false}
        return true
    })

    async function fetchMoveData(move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl) {return}

        // check cache for move
        let c = {}
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in c) {
            setSkill(c[move])
            console.log('found move in cache')
            return
        }

        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('fetched move from API', moveData)

            const desc = moveData?.flavor_text_entries.filter(val => {
                return val.version_group.name == 'firered-leafgreen'
            })[0]?.flavor_text

            const skillData = {
                name: move,
                desc
            }

            setSkill(skillData)
            c[move] = skillData

            localStorage.setItem('pokemon-moves', JSON.stringify(c))

            console.log(skillData)
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingSkill(false)
        }
    }

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

    return (
        <div className = 'poke-card'>
            {skill && (
                <Modal handleCloseModal={() => { setSkill(null)}}>
                    <div>
                        <h6>Name</h6>
                        <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill.desc}</p>
                    </div>
                </Modal>
            )}


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

                    {moves.map((moveObj, moveIndex) => {
                        return (
                            <button className='button-card pokemon-move' key={moveIndex} onClick={() => {
                                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                            }}>
                                <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                            </button>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

