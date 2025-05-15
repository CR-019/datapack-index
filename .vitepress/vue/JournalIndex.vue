<template>
    <section class="featured-cover">
      <!-- 封面大图 -->
      <div class="cover-container">
        <a v-if="coverLink" :href="coverLink" class="cover-link">
          <img :src="cover" alt="本期封面" class="cover-image" />
        </a>
        <img v-else :src="cover" alt="本期封面" class="cover-image" />
      </div>
    </section>
  </template>
  
  <script>
  export default {
    props: {
      cover: {
        type: String,
        required: true
      },
      coverLink: {
        type: String
      }
    }
  }
  </script>
  
  <style scoped>
  .featured-cover {
    max-width: 600px; 
    margin: 0 auto;
  }
  
  /* 封面容器 */
  .cover-container {
    margin: 0 auto;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
  }
  
  .cover-image {
    width: 100%;
    height: auto;
    max-height: 400px; /* 控制最大高度 */
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .cover-image:hover {
    transform: scale(1.02);
  }
  </style>