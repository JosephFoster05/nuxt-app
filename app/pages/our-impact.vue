<script setup>
// we can add content later for now this is just a placeholder page
// we can add stats, images, testimonials, etc. about the impact of the organization here

// in the stats section we can fetch some data from an api endpoint in the future if needed
// for now we will just hardcode some stats?

const dummyStats = {
    clothingDonated: 10000,
    peopleHelped: 5000,
    communitiesServed: 50
}


</script>


<template>
    <div>
        <h2>Our Impact</h2>
        <p>This is the Our Impact page. More content coming soon!</p>
    </div>

    <section id="stats">
        <h3>Statistics</h3>
        <ul>
            <li>Clothing items donated: {{ dummyStats.clothingDonated }}+</li>
            <li>People helped: {{ dummyStats.peopleHelped }}+</li>
            <li>Communities served: {{ dummyStats.communitiesServed }}+</li>
        </ul>
    </section>
</template>
