<template>
  <div>
    <div class="pokemon-container">
      <header class="pokemon-container__header">
        Pokemon List
      </header>
      <main>
        <div
        v-for="(pok, index) in pokemons"
        :key="index"
        >
        <p>No. {{ pok.no }}</p>
        <p>Name: {{ pok.name}}</p>
        <div
        v-for="(meaning, index) in pok.meanings"
        :key="index"
        >
          <p>Origin: {{ meaning.origin }}</p>
          <p>Definition: {{ meaning.def }}</p>
        </div>
        <p>Chinese Name: {{ pok.chinese_name }}</p>
      </div>
      </main>
    </div>


  </div>
</template>

<script>
import { queryPokemon } from '../utils/sqlitedb.js';
export default {
  data() {
    return {
      pokemons: []
    }
  },
  async mounted() {
    console.log("🚀 ~ mounted ~ mounted:")
    this.pokemons = await queryPokemon(1, 151, 10, 0);
  }
}
</script>