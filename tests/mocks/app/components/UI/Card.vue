<template>
  <div>
    <h4>{{ header || $t("Title card") }}</h4>
    <p>{{ descriptionData }}</p>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  computed: {
    descriptionData() {
      return this.description || this.$t('No description');
    }
  },
};
</script>
