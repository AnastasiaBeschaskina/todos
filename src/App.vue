<template>
  <nav>
    <router-link to="/">Task Schedule</router-link> 
    <router-link to="/interviewTasks">Task Planner</router-link> 
    <router-link to="/checker">Resume Checker</router-link>
  </nav>
  <router-view/>
</template>

<style lang="scss">
@import "@/styles/styles.scss";
#app {
  font-family: Inter, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

nav {
  padding: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  text-decoration: none;
  justify-content: center;
  gap: 3rem;


  a {
    font-weight: bold;
    color: #2d3639;
    text-decoration: none;
    font-family: Rubik;
  font-style: normal;


    &.router-link-exact-active {
      color: $primary-color;
      
    }
  }
  a:hover {
    text-decoration: none;
    color: $secondary-color-hover;
  }
}
</style>
