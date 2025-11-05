


<template>
  <section id="title">
      <h1>Sustain Wear</h1>
    <img src="/images/LaundryStack.jpg" alt="An Image of Fresh Clothes Stacked Upon Each Other">
  </section>


  <section id="mainIntroduction">
      <div class="infoBox">
          <h3>What?</h3>
          <p>At SustainWear we are Commited to Helping Reduce CO2 Emissions Caused by Clothes Waste. We aim to Provide a Friendly way to Donate Unwanted Clothes.</p>
      </div>
      <div id="seperator"><br></div>
      <div class="infoBox">
          <h3>Why?</h3>
          <p>Pollution Has Become an Even More Prevalent Problem in the Modern Day. It's up to People Like us to Make a Change.</p>
      </div>
  </section>


  <section id="variableStatistic">
    <img src="/images/PollutionLandscape.jpg" alt="An Image of a foggy woodland with a large chute of polluted smoke in the background.">
      <div id="infoBox">
          <h3>2025</h3>
          <p>This Year Alone we Have Reduced Over 750 Tonnes of CO2 Emissions That Would Have been Caused by Unwanted Clothing!</p>
          <br>
          <p>Consider donating to help contribute to our cause.</p>
      </div>
  </section>

  <section id="variableStatistic">
    <img src="/images/ClothesonHangers.jpg" alt="An Image of blazers hung by hangers with a soft, golden glow on the background.">

  </section>

  <hr class="divider">

</template>

<script setup>
// No script logic needed for this static page yet
</script>

<style scoped>
/* Basic styling to resemble the original Blade page */
.welcome-page { max-width: 1000px; margin: 0 auto; padding: 20px; }
#title { text-align: center; margin-bottom: 18px; }
#title h1 { font-size: 2.2rem; margin-bottom: 12px; }
#title img { width: 100%; max-height: 420px; object-fit: cover; border-radius: 6px; }

#mainIntroduction { display: flex; gap: 16px; align-items: flex-start; margin: 20px 0; flex-wrap: wrap; }
.infoBox { flex: 1 1 300px; background: #fafafa; padding: 16px; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.03); }
#seperator { width: 12px; }

.variableStatistic { display: flex; gap: 16px; align-items: center; margin: 20px 0; flex-wrap: wrap; }
.variableStatistic img { width: 100%; max-width: 520px; border-radius: 6px; object-fit: cover; }
#infoBox { flex: 1 1 300px; }

.divider { border: none; border-top: 1px solid #e5e5e5; margin: 22px 0; }

.cta { text-align: center; margin: 12px 0 40px; }
.btn { background: #2b8a3e; color: #fff; padding: 10px 18px; border-radius: 6px; text-decoration: none; }
.btn:hover { opacity: 0.95; }

@media (max-width: 700px) {
  #mainIntroduction, .variableStatistic { flex-direction: column; }
}
</style>
