<template>
    <div class="color-line">
      <div></div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ColorLine",
  };
  </script>
  
  <style scoped>
  .color-line {
    display: flex;
    margin: 20px 0;
    height: 2px;
  }
  
  .color-line::before,
  .color-line::after,
  .color-line>div {
      content: "";
      flex: 1;
  }
  
  .color-line::before {
      background: #c47c4e;
  }
  
  .color-line>div {
      background: #74b096;
  }
  
  .color-line::after {
      background: #694ec6;
  }
  </style>