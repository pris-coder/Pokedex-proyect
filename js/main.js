//Funcion para agregar el color del pokemon
const fetchPokemonColor = async (pokemonId) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        return response.data.color.name; // Retorna el nombre del color
    } catch (error) {
        console.log(`Error fetching color for Pokémon ID ${pokemonId}:`, error);
        return "unknown"; // Devuelve un valor por defecto en caso de error
    }
};



//Funcion que va a crear la tarjeta pokemon

const createPokemonCard = (pokemon, colorName) => {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("pokemon-info");

    const name = document.createElement("h2");
    name.classList.add("pokemon-name");
    name.textContent = pokemon.name;

    const typesDiv = document.createElement("div");
    typesDiv.classList.add("pokemon-types");

    pokemon.types.forEach((type) => {
        
        const typeSpan = document.createElement("span");
        typeSpan.classList.add("pokemon-type", type.type.name);
        typeSpan.textContent = type.type.name;
        typesDiv.appendChild(typeSpan);
    });

    const colorSpan = document.createElement("span");
    colorSpan.classList.add("pokemon-color");
    colorSpan.textContent = colorName;
    typesDiv.appendChild(colorSpan);

    infoDiv.appendChild(name);
    infoDiv.appendChild(typesDiv);

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("pokemon-image-container");

    const image = document.createElement("img");
    image.classList.add("pokemon-image");
    image.src = pokemon.sprites.front_default;
    image.alt = pokemon.name;

    imageContainer.appendChild(image);

    card.appendChild(infoDiv);
    card.appendChild(imageContainer);

    return card;
};




const loadPokemons = async () => {
    const pokemonGrid = document.getElementById("pokemon-grid");
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon", {params: {limit: 52}});
        const pokemons = response.data.results;

        const pokemonDetailsPromises = pokemons.map((pokemon) => axios.get(pokemon.url));
        const pokemonDetails = await Promise.all(pokemonDetailsPromises);

        const pokemonColorsPromises = pokemonDetails.map((details) =>
            fetchPokemonColor(details.data.id)
        );
        const pokemonColors = await Promise.all(pokemonColorsPromises);
        
        pokemonGrid.innerHTML = '';

        pokemonDetails.forEach((details, index) => {
            const pokemonCard = createPokemonCard(details.data, pokemonColors[index]);
            pokemonGrid.appendChild(pokemonCard);
        });

        

        for(const pokemon of pokemons) {
            const detailsResponse = await axios.get(pokemon.url)
            const pokemonCard = createPokemonCard(detailsResponse.data);
            pokemonGrid.appendChild(pokemonCard);
        }

        } catch (error) {
            console.log("Error fetch:", error);
        }
    };

document.addEventListener("DOMContentLoaded", loadPokemons);




//Funcion para buscar pokemons

const searchPokemon = async () => {
    const pokemonName = document.getElementById('pokemon-search').value.toLowerCase();
    if (pokemonName) {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const pokemonGrid = document.getElementById('pokemon-grid');
            pokemonGrid.innerHTML = '';
            const pokemonCard = createPokemonCard(response.data);
            pokemonGrid.appendChild(pokemonCard);
        } catch (error) {
            console.log('Error al buscar el pokemon:', error);
        }
    }
};

document.getElementById('search-button').addEventListener('click', searchPokemon);
document.getElementById('pokemon-search').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchPokemon();
    }
});

