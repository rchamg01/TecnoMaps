<template>
  <v-app>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      data-projection="EPSG:4326"
    >
      <vl-view
        :zoom.sync="zoom"
        :center.sync="center"
        :rotation.sync="rotation"
        :max-zoom="maxZoom"
      ></vl-view>
      <!-- En Bing Maps no hay más zoom de 19 -->
      <vl-layer-tile>
        <vl-source-bingmaps :api-key="apiKey" :imagery-set="imagerySet"></vl-source-bingmaps>
      </vl-layer-tile>
    </vl-map>
  </v-app>
</template>

<script>
import OverviewMap from "ol/control/OverviewMap";

export default {
  name: "Map",
  data() {
    return {
      zoom: 5,
      center: [-5.2, 41],
      rotation: 0,
      maxZoom: 19,
      apiKey:
        "AljABXVYxUw9xFjAIFZIvjdgHaxgFConuMDkjLRsPLa1N4vMF2SMRN3BBJMGKdO6",
      imagerySet: "AerialWithLabels",
      componentKey: 0
    };
  },
  methods: {
    onMapMounted() {
      // now ol.Map instance is ready and we can work with it directly
      this.$refs.map.$map.getControls().extend([
        new ScaleLine(),
        new FullScreen(),
        new OverviewMap({
          collapsed: false,
          collapsible: true
        }),
        new ZoomSlider()
      ]);
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~ol/ol.css';
</style> 