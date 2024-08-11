document.addEventListener('DOMContentLoaded', async() => {
    res = await fetch('https://restcountries.com/v3.1/region/oceania?fields=name,population,area');
    let data = await res.json();

    let tm_container = document.querySelector('#tm_container');

    const total_population = data.reduce((acc, curr) => {
        return acc += curr.population;
    }, 0)

    const total_area = data.reduce((acc, curr) => {
        return acc += curr.area;
    }, 0)
    
    const ratio_per_country = data.map((curr) => {
        return {
            "name": curr.name.common,
            "population_ratio": curr.population / total_population,
            "area_ratio": curr.area / total_area,
        }
    })
    
    ratio_per_country.sort((a, b) => {
        return b.population_ratio - a.population_ratio;
    })

    const max_color_ratio = ratio_per_country[0].population_ratio;

    ratio_per_country.sort((a, b) => {
        return b.area_ratio - a.area_ratio; 
    })

    const base_row = Math.ceil(ratio_per_country.length * (tm_container.offsetHeight / tm_container.offsetWidth));

    ratio_per_country.forEach((curr) => {
        let div = document.createElement("div");
        div.setAttribute('style', `
            grid-column: span ${Math.ceil(curr.area_ratio * base_row)}; 
            grid-row: span ${Math.ceil(curr.area_ratio * base_row)};
            background-color: rgba(255, 0, 0, ${curr.population_ratio / max_color_ratio})
            `);
        let h5 = document.createElement('h5');
        let country = document.createTextNode(`${curr.name}`);
        h5.appendChild(country);
        div.appendChild(h5);
        tm_container.appendChild(div); 
    })

    console.log(`${ratio_per_country.length} * (${tm_container.offsetHeight} / ${tm_container.offsetWidth})`)
    //versão alternativa: comente este método
    tm_container.setAttribute( 
        'style',  `grid-template-rows: repeat(${base_row}, ${tm_container.offsetHeight / base_row}px);` 
    ); 
})