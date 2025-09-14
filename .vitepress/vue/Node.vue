<template>

    <img :src="iconSrc" :alt="type" class="nbt-icon" />
    <!-- Required indicator -->
    <span
      v-if="required"
      class="indicator required"
      title="此项为必选项"
    >
      *
    </span>
    <!-- Store indicator -->
    <span
      v-if="store"
      class="indicator store"
      title="存储时必存在"
    >
      *
    </span>
    <strong>{{ name }}</strong
    ><span v-if="shouldShowColon">:</span>
</template>

<script>
export default {
  name: "NbtTypeTag",
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        return [
          'any', 'bool', 'byte_list', 'byte', 'list', 'double',
          'float', 'homolist', 'int_list', 'int', 'long_list', 'long',
          'compound', 'short', 'string'
        ].includes(value);
      }
    },
    name: {
      type: String,
      default: '' // Allow name to be optional
    },
    // New props
    required: {
      type: Boolean,
      default: false
    },
    store: {
      type: Boolean,
      default: false
    },
    colon: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    iconSrc() {
      const typeToIconMap = {
        any: 'any',
        bool: 'bool',
        byte_list: 'byte_array',
        byte: 'byte',
        list: 'Data_node_list',
        double: 'double',
        float: 'float',
        homolist: 'homolist',
        int_list: 'int_array',
        int: 'int',
        long_list: 'long_array',
        long: 'long',
        compound: 'object',
        short: 'short',
        string: 'string'
      };
      const iconName = typeToIconMap[this.type] || 'any';
      return `/datapack-index/nbt_sprites/${iconName}.svg`;
    },
    shouldShowColon() {
      return (this.name !== undefined && this.name !== null && this.name.trim() !== '') && this.colon == true;
    }
  }
};
</script>


<style scoped>


.nbt-type-icon {
  margin-right: 0.3em; 
}

.indicator {
  position: relative;
  font-weight: bold;
  margin-left: -0.3em;
  margin-right: -1.2em;
}

.indicator.required {
  color: red;
  /* Optional: Make it a superscript */
  top: -0.4em; 
  font-size: 0.7em;
}

.indicator.store {
  color: blue;
  /* Optional: Make it a subscript */
  bottom: -0.2em;
  font-size: 0.7em; 
}
</style>