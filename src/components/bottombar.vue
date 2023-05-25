<template>
  

<div class="bottombar">

  <div style="display: flex; list-style-type: none; overflow-x: auto;">
    <div style="padding: 1rem; min-width: 74px;">
      <router-link to="/" class="bottom-bar-link">

        Home
        <span class="material-symbols-outlined bottom-bar-icon" >
          home
        </span>
      </router-link>
    </div>
    <!-- <div>F2</div> -->
    <div style="padding: 1rem; min-width: 74px;">
      <router-link to="/progress" class="bottom-bar-link">Progress
        <span class="material-symbols-outlined bottom-bar-icon">
          event_note
        </span>
      </router-link>
    </div>

    <div style="padding: 1rem; min-width: 74px;">
      <router-link to="/settings" class="bottom-bar-link">
        Settings
        <span class="material-symbols-outlined bottom-bar-icon">
          settings
        </span>
      </router-link>
    </div>

    <div style="padding: 1rem; min-width: 74px;">
      <router-link to="/about" class="bottom-bar-link">About
        <span class="material-symbols-outlined bottom-bar-icon">
          help
        </span>
      </router-link>
    </div>


  </div>
</div>
</template>

<style scoped>
.bottom-bar-link {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    text-decoration: none;
    padding: 0.2rem 1rem;
}
@media (min-width: 1024px) {
  .bottom-bar-icon {
    display: none;
  }
}

</style>

