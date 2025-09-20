<template>
  <div>
    <div class="pokemon-container">
      <header class="pokemon-container__header">
        Pokemon List
      </header>
      <main>
        <div class="pokemon__search-bar">
          <input type="text" name="" id="" :placeholder="placeholder" v-model="searchText" class="pokemon__search-input" @keyup.enter="search(searchText)">
          <span class="material-symbols-outlined" @click="search(searchText)" >
            search
          </span>
        </div>
        <div
        v-for="(pok, index) in pokemons"
        :key="index"
        class="pokemon__item"
        >
          <p>No. {{ pok.no }}</p>
          <p>Name: {{ pok.name }}</p>

          <div v-if="isMobile">
            <div
              v-for="meaning in JSON.parse(pok.meanings).meanings"
              
            >
              <p>Origin: {{ meaning.origin }}</p>
              <p>Definition: {{ meaning.def }}</p>
            </div>
          </div>
          <div v-else>
            <div
              v-for="meaning in pok.meanings"
              
            >
              <p>Origin: {{ meaning.origin }}</p>
              <p>Definition: {{ meaning.def }}</p>
            </div>
          </div>
          <p>Chinese Name: {{ pok.chinese_name }}</p>
        </div>
        <nav class="pokemon__pagination">
          <span class="material-symbols-outlined pokemon__pagination__btn" @click="offset = Math.max(0, offset - limit); search(searchText, limit, offset)">
            arrow_left_alt
          </span>
          <span class="material-symbols-outlined pokemon__pagination__btn" @click="offset = offset + limit; search(searchText, limit, offset)">
            arrow_right_alt
          </span>

        </nav>

      </main>
    </div>


  </div>
</template>

<script>
import { queryPokemon, queryPokemonByName } from '../utils/sqlitedb.js';
export default {
  data() {
    return {
      pokemons: [],
      searchText: "",
      placeholder: "Search by name",
      limit: 10,
      offset: 0,
    }
  },
  async mounted() {
    console.log("🚀 ~ mounted ~ mounted:")
    this.pokemons = await queryPokemon(1, 151, 10, 0);
  },
  methods: {
    async search(keyword, limit = 10, offset = 0) {
      try {
        this.pokemons = await queryPokemonByName(keyword, limit, offset);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.log("🚀 ~ search ~ error:", error)
        
      }

    }
  }
}
</script>

<style>
.search-page {
  width: 100%;
  min-height: min-content;
}
.pokemon__search-bar {
  display: flex;
  align-items: center;
}
.pokemon__item {
  border: 1px ;
  border-color: white;
  border-style: solid;
  border-radius: 0.2rem;
  margin: 5px;
  padding: 5px;
}

.pokemon__search-input {
  flex-grow: 1;
  background: var(--color-background-soft);
    border-radius: 0.2rem;
    font-size: 1rem;
    padding: 0.2rem;
    color: var(--color-text);
    border-color: white;
    border-style: solid;
}
.pokemon__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}
.pokemon__pagination__btn {
  cursor: pointer;
  font-size: 2rem;
  margin: 0 1rem;
}

</style>