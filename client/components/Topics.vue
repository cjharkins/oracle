<template lang="html">
  <div>
    <navigation/>
    <main class="nc-container">
      <header class="nc-header">
        <h3>Topics</h3>
      </header>
      <div class="nc-inner-container nc-flex nc-flex--wrap">
        <div v-if="$store.state.user.properties" v-for="(topic, index) in $store.state.user.properties.topics"
             class="nc-topic-card"
             :class="{'nc-topic-card--selected': topic.selected}"
             @click="handleTopicClick(index)">
          {{topic.name}}
        </div>
      </div>
    </main>
  </div>
</template>
<script type="text/javascript">
  import Navigation from './Navigation.vue'
  export default {
    components: {
      Navigation
    },
    methods: {
      handleTopicClick(topicIndex) {
        this.$store.commit('user/UPDATE_SELECTED_TOPICS', topicIndex)
      }
    }
  }
</script>
