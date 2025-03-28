import { useEffect, useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../utils"

export default function SideNav(props) {
    const { selectedPokemon, setSelectedPokemon, handleToggleMenu, showSideMenu } = props
    const [searchValue, setSearchValue] = useState('')

    const pokemonList = first151Pokemon.filter((ele, eleIndex) => {
        if ((getFullPokedexNumber(eleIndex)).includes(searchValue) || ele.toLowerCase().includes(searchValue.toLowerCase())) {
            return true
        }

        return false    
    })

    return (
        <nav className = {'' + (!showSideMenu ? "open":'')}>
            <div className={"header " + (!showSideMenu ? "open":'')}>
                <button className="open-nav-button" onClick={() => {
                    handleToggleMenu()
                }}>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className = {"text-gradient"}>PokeDex!</h1>
            </div>

            <input placeholder = 'E.g 001 or Bulba...' type = 'text' value = {searchValue} onChange = {(e) => {
                setSearchValue(e.target.value)
            }}/>

            {pokemonList.map((pokemon, pokIndex) => {
                return(
                    <button key = {pokIndex} className={'nav-card' + (pokIndex === selectedPokemon ? 'nav-card-selected' : ' ')} 
                    onClick = {() => {
                        setSelectedPokemon(first151Pokemon.indexOf(pokemon))
                        handleToggleMenu()
                    }}>
                        <p>{getFullPokedexNumber(first151Pokemon.indexOf(pokemon))}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}