<template>
  <v-app>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      data-projection="EPSG:4326"
    >
      <!-- En Bing Maps no hay más zoom de 19 -->
      <vl-layer-tile>
        <vl-source-bingmaps :api-key="apiKey" :imagery-set="imagerySet"></vl-source-bingmaps>
      </vl-layer-tile>
      <vl-view
        :zoom.sync="zoom"
        :center.sync="center"
        :rotation.sync="rotation"
        :max-zoom="maxZoom"
      ></vl-view>

      <vl-layer-tile v-for="layer in layers" v-bind:key="layer.layerName">
        <vl-source-wms
          :opacity="layer.opacity"
          :url="layer.url"
          :params="layer.params"
          :layers="layer.layerName"
          v-if="layer.visible"
        ></vl-source-wms>
      </vl-layer-tile>

      <v-navigation-drawer
        :mini-variant.sync="mini"
        absolute
        right
        fixed
        class="blue-grey darken-1"
      >
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile>
              <v-list-tile-avatar>
                <v-btn icon @click.stop="mini = !mini">
                  <v-icon>menu</v-icon>
                </v-btn>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>Layers</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon @click.stop="mini = !mini">
                  <v-icon>chevron_right</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-toolbar>
        <v-list>
          <v-divider></v-divider>
          <v-list-tile v-for="layer in layers" :key="layer.name">
            <v-list-tile-avatar>
              <v-switch v-model="layer.visible" :disabled="mini" color="orange" dark></v-switch>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{layer.name}}</v-list-tile-title>
              <v-list-tile-sub-title>{{layer.description}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </vl-map>
  </v-app>
</template>

<script>
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
      componentKey: 0,
      mini: true,
      layers: [
        /*{
          //Estados
          url: "https://ahocevar.com/geoserver/wms",
          params: { LAYERS: "topp:states", TILED: true },
          name: "Estados",
          visible: true
        },
        {
          //Lluvias
          url: "https://mesonet.agron.iastate.edu/cgi-bin/wms/us/mrms_nn.cgi?",
          params: { LAYERS: "mrms_p72h" },
          name: "Lluvias",
          visible: true
        },
        {
          //Austria(?)
          url: "https://wms.geo.admin.ch/",
          params: { LAYERS: "ch.babs.kulturgueter", TILED: true },
          name: "Austria",
          visible: true
        } /*,
       {
          url: "http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS",
          params: { LAYERS: "OI.OrthoimageCoverage", TILED: true },
          serverType: "geoserver",
          transition: 0,
          name: "OI.OrthoimageCoverage"
        }*/
      ],
      disabled: true
    };
  },
  mounted() {
    var data = this.$store.getters.getUser;
    this.$store
      .dispatch("getLayers", data)
      .then(() => {
        this.layers = this.$store.getters.getLayers;
      })
      .catch(err => {});
  },
  methods: {}
};
</script>

<style scoped lang="stylus">
@import '~ol/ol.css';

.map-panel {
  padding: 0;
}
</style> 