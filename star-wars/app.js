class StarWarsApp {
  constructor(rootId) {
    this.root = document.getElementById(rootId);
    this.chars = [];
    this.init();
  }

  init() {
    this.root.innerHTML = `
        <label for='characters'>Characters</label>
        <select name='characters' id='characters'></select>
        <div id='films'></div>
      `;

    this.fetchChars().then((chars) => {
      this.populateDropDownOptions(chars);
    });

    this.root.addEventListener("change", (e) => {
      if (e.target.id === "characters") {
        this.handleDropDownChange(e);
      }
    });
  }

  async fetchChars() {
    try {
      const jsonRes = await fetch("https://swapi.dev/api/people");
      const res = await jsonRes.json();
      return res.results;
    } catch (error) {
      console.error("Failed to fetch characters:", error);
      return [];
    }
  }

  populateDropDownOptions(characters) {
    const select = document.getElementById("characters");
    const fragment = document.createDocumentFragment();
    const option = document.createElement("option");
    option.text = "FILMS";
    option.value = "";
    fragment.appendChild(option);

    characters.forEach((character) => {
      const option = document.createElement("option");
      option.text = character.name;
      option.value = JSON.stringify(character);
      fragment.appendChild(option);
    });
    select.appendChild(fragment);
  }

  async handleDropDownChange(e) {
    if (!e.target.value) {
      document.getElementById("films").innerHTML = "";
      return;
    }
    const character = JSON.parse(e.target.value);
    const { films } = character;
    const promises = films.map((film) => fetch(film));

    try {
      const res = await Promise.allSettled(promises);
      const data = await Promise.all(
        res.map(async (r) =>
          r.status === "fulfilled" ? await r.value.json() : null
        )
      );
      this.displayFilms(data.filter((film) => film !== null));
    } catch (error) {
      console.error("Failed to fetch films:", error);
    }
  }

  displayFilms(films) {
    const filmsDiv = document.getElementById("films");
    filmsDiv.innerHTML = ""; // Clear previous list
    const ul = document.createElement("ul");
    ul.id = "films-list";
    films.forEach((film) => {
      const li = document.createElement("li");
      li.innerHTML = film.title;
      ul.appendChild(li);
    });
    filmsDiv.appendChild(ul);
  }
}

new StarWarsApp("root");
