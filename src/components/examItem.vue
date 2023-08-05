<template>
  <div class="exam_outer">
    <header class="exam_header">What is the meaning of {{ word }}? </header>
    <section class="exam_item">
      <div v-for="(question, index) in questions" :key="index" :value="index" @click="clearSubmittedMsg()" class="exam_option">
        <input type="radio" :id="index" :value="index" v-model="inputtedAns" />
        <label :for="index" class="exam_label">{{question}}</label>
      </div>

      <!-- <select v-model="inputtedAns" >
        <option v-for="(question, index) in questions" :key="index" :value="index">
          {{ question }}
        </option>
      </select> -->
      <span class="exam_submit_msg">{{ submittedMsg }}</span>
      <button type="submit" @click="submitExam()" class="exam_submit">Submit</button>
    </section>
  </div>
</template>

<script>
import { queryExceptWord } from '../utils/sqlitedb.js';
const CORRECT_MSG = "So Smart! You are correct.";
const WRONG_MSG = "Please try again.";
export default {
  props: ['word', 'def'],
  // props: {
  //   word: {
  //     type: Object,
  //     default: () => { return { text: '', def: '' };}
  //   }
  // },
  data() {
    return {
      questions: [],
      ansPosition: -1,
      inputtedAns: -1,
      submittedMsg: ""
    }
  },
  async mounted() {
    console.log("🚀 ~ file: examItem.vue:42 ~ mounted ~ mounted:")
    const others = await this.getOtherChoices();
    const {ansPosition, questions} = await this.createQuestion(this.word, others, 5);
    this.ansPosition = ansPosition;
    this.questions = questions;
  },
  // async activated() {
  //   console.log("🚀 ~ file: examItem.vue:48 ~ activated ~ activated:")
  //   const others = await this.getOtherChoices();
  //   const {ansPosition, questions} = await this.createQuestion(this.word, others, 5);
  //   this.ansPosition = ansPosition;
  //   this.questions = questions;
  // },
  methods: {
    clearSubmittedMsg() {
      this.submittedMsg = "";
    },
    async submitExam() {
      try {

        if(this.inputtedAns !== -1 && this.ansPosition === this.inputtedAns ){
          this.submittedMsg = CORRECT_MSG;
          return;
        }
        this.submittedMsg = WRONG_MSG;

      } catch (error) {
        console.log("🚀 ~ file: examItem.vue:39 ~ submitExam ~ error:", error)
        
      }
    },
    async getOtherChoices() {
      try {
        return await queryExceptWord(this.word);
      } catch (error) {
        console.log("🚀 ~ file: examItem.vue:18 ~ getOtherChoices ~ error:", error)
        
      }
    },
    async createQuestion(word, otherWords, max) {
      console.log("🚀 ~ file: examItem.vue:63 ~ createQuestion ~ word:", word)
      console.log("🚀 ~ file: examItem.vue:63 ~ createQuestion ~ otherWords:", JSON.stringify(otherWords))
      try {
        //should be 0-4, max=5
        let questions = [];
        const ansPosition = Math.floor(Math.random() * max);
        for(let i = 0; i < max; ++i) {
          if(i === ansPosition) {
            questions.push(this.def);
          }
          else {
            questions.push(otherWords.pop().definition);

          }
        }
        return { ansPosition, questions };
        
      } catch (error) {
        console.log("🚀 ~ file: examItem.vue:27 ~ createQuestion ~ error:", error)
        
      }
    }
  }
}
</script>

<style scoped>
  .exam_outer {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    padding-bottom: 10px;
  }
  .exam_item {
    display: flex;
    flex-direction: column;
  }
  .exam_option {
    display: flex;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid;
  }
  .exam_label {
    padding:1rem;
    overflow: hidden;
    word-wrap: break-word;
  }
  .exam_header {
    font-size: 1.3rem;
    padding: 1rem;
  }
  .exam_submit_msg {
    margin-top: 0.5rem;
    margin-left: 1rem;
  }
  .exam_submit {
    background-color: var(--color-background);
    color: var(--color-text);
    padding: 1rem;
    margin: 0.5rem 0;
    border: 1px solid;
  }
</style>
