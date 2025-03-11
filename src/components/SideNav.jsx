import { first151Pokemon, getFullPokedexNumber } from "../utils"

export function SideNav() {
    return (
        <nav>
            <div className={"header"}>
                <h1 className = {"text-gradient"}>PokeDex!</h1>
            </div>

            <input />

            {first151Pokemon.map((pokemon, pokIndex) => {
                return(
                    <button className={'nav-card'}>
                        <p>{getFullPokedexNumber(pokIndex)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}