
document.getElementById("search").addEventListener("click", searchCountry);

async function searchCountry() {
    const inputCountry = document.getElementById("input-box").value.trim();
    const DisplayCountryInfo = document.getElementById("country-info");
    DisplayCountryInfo.innerHTML = "";
    const NeighbourInfo = document.getElementById("bordering-countries");
    NeighbourInfo.innerHTML = "";

    if (!inputCountry) {
        alert("Please enter a country name.");
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${inputCountry}`);
        const data = await response.json();

        DisplayCountryInfo.innerHTML = "";

        if (!Array.isArray(data) || data.status) {
            display.textContent = "Country not found.";
            return;
        }
        const country = data[0];

        const name = document.createElement("h2");
        name.innerHTML = country.name.common;

        const capital = document.createElement("p");
        capital.innerHTML = `<strong>Capital:</strong> ${country.capital?.[0] || "N/A"}`;

        const population = document.createElement("p");
        population.innerHTML = `<strong>Population:</strong> ${country.population.toLocaleString()}`;

        const region = document.createElement("p");
        region.innerHTML = `<strong>Region:</strong> ${country.region}`;

        const flag = document.createElement("img");
        flag.src = country.flags.png; 
        flag.alt = `Flag of ${country.name.common}`;
        flag.width = 200;

        DisplayCountryInfo.append(name)
        DisplayCountryInfo.append(capital)
        DisplayCountryInfo.append(population) 
        DisplayCountryInfo.append(region)
        DisplayCountryInfo.append(flag);

        const borders = country.borders;
    if (borders && borders.length > 0) {
    const requests = borders.map(border =>
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
        .then(response => response.json())
    );

    const neighbours = await Promise.all(requests);
    NeighbourInfo.innerHTML = "<h2>Bordering Countries:</h2>";

    neighbours.forEach(data => {
        if (Array.isArray(data) && data.length > 0) {
            const neighbour = data[0];
            NeighbourInfo.innerHTML += `
                <article>
                    <p>${neighbour.name.common}</p>
                    <img src="${neighbour.flags.png}" alt="Flag of ${neighbour.name.common}" width="100">
                </article>`;
        }
    });
    } else {
    NeighbourInfo.innerHTML = "<p>There are no neighboring countries.</p>";
}
    } catch {
        display.textContent = "Error fetching data. Please try again.";
    }
}

