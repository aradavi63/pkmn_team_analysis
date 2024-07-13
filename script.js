let pokemonData = [];

document.addEventListener('DOMContentLoaded', () => {
    // Fetch the Pokémon data
    fetch('pkmn_data.json')
        .then(response => response.json())
        .then(data => {
            // Parse the semicolon-separated data into arrays
            pokemonData = data.map(item => item[0].split('; '));
            // Add event listeners to all search inputs
            const searchInputs = document.querySelectorAll('input[type="text"]');
            searchInputs.forEach(input => {
                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        searchPokemon(input.id);
                    }
                });
                input.addEventListener('input', () => {
                    showSuggestions(input.id);
                });
            });
        })
        .catch(error => console.error('Error loading Pokémon data:', error));
});

function searchPokemon(searchId) {
    const searchInput = document.getElementById(searchId).value.toLowerCase();
    const resultDiv = document.getElementById('result' + searchId.slice(-1));
    resultDiv.innerHTML = '';

    if (searchInput.length === 0) {
        return;
    }

    const matchedIndexes = [];
    for (let i = 0; i < pokemonData.length; i++) {
        if (pokemonData[i][1].toLowerCase() === searchInput) {
            matchedIndexes.push(i);
        }
    }

    if (matchedIndexes.length > 0) {
        matchedIndexes.forEach(index => {
            const pokemonDiv = document.createElement('div');
            const pokemonImage = document.createElement('img');
            const pokemonInfo = document.createElement('p');

            const name = pokemonData[index][1];
            const types = pokemonData[index][2];

            pokemonImage.src = `/icons/pkmn_icons/${name}.png`;
            pokemonImage.alt = name;
            pokemonInfo.innerHTML = `<strong>${name}</strong><br>Type: ${types}`;

            pokemonDiv.appendChild(pokemonImage);
            pokemonDiv.appendChild(pokemonInfo);
            resultDiv.appendChild(pokemonDiv);
        });
    } else {
        resultDiv.innerHTML = '<p>No Pokémon found</p>';
    }
}

function showSuggestions(inputId) {
    const searchInput = document.getElementById(inputId).value.toLowerCase();
    const suggestionsDiv = document.getElementById('suggestions' + inputId.slice(-1));
    suggestionsDiv.innerHTML = '';

    if (searchInput.length === 0) {
        return;
    }

    const suggestions = pokemonData.filter(pokemon => 
        pokemon[1].toLowerCase().includes(searchInput)
    ).slice(0, 10); // Limit suggestions to top 10 matches

    suggestions.forEach(pokemon => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = pokemon[1];
        suggestionItem.addEventListener('click', () => {
            document.getElementById(inputId).value = pokemon[1];
            suggestionsDiv.innerHTML = '';
            searchPokemon(inputId);
        });
        suggestionsDiv.appendChild(suggestionItem);
    });
}
