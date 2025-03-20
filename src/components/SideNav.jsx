import { first151Pokemon, getFullPokedexNumber } from "../utils"

export default function SideNav(props) {
    const { selectedPokemon, setSelectedPokemon } = props

    return (
        <nav>
            <div className={"header"}>
                <h1 className = {"text-gradient"}>PokeDex!</h1>
            </div>

            <input />

            {first151Pokemon.map((pokemon, pokIndex) => {
                return(
                    <button key = {pokIndex} className={'nav-card'} 
                    onClick = {() => {
                        setSelectedPokemon(pokIndex)
                    }}>
                        <p>{getFullPokedexNumber(pokIndex)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}