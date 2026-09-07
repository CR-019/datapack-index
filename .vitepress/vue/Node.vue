<template>

    <NbtIcon :type="type" :text="name" />
    <!-- Required indicator -->
    <span
      v-if="required"
      class="indicator required"
      :title="requiredTitle"
    >
      *
    </span>
    <!-- Store indicator -->
    <span
      v-if="store"
      class="indicator store"
      :title="storeTitle"
    >
      *
    </span>
    <span v-if="shouldShowColon" class="nbt-node-colon">:</span>
</template>

<script>
import { useData } from 'vitepress'
import NbtIcon from './NbtIcon.vue'

export default {
  name: "NbtTypeTag",
  components: { NbtIcon },
  setup() {
    const { lang } = useData()
    return { lang }
  },
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
    requiredTitle() {
      return String(this.lang || '').startsWith('en') ? 'Required field' : '此项为必选项'
    },
    storeTitle() {
      return String(this.lang || '').startsWith('en') ? 'Always present when stored' : '存储时必存在'
    },
    shouldShowColon() {
      return (this.name !== undefined && this.name !== null && this.name.trim() !== '') && this.colon == true;
    }
  }
};
</script>


<style scoped>


.nbt-node-colon {
  margin-right: 0.3em;
}

.indicator {
  position: relative;
  font-weight: bold;
  margin-left: 0.1em;
  margin-right: 0.1em;
  display: inline-block;
  cursor: help;
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
