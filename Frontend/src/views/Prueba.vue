<template>
  <v-app>
    <v-btn @click="returnToLogin"></v-btn>
    <v-spacer></v-spacer>
    <v-select :items="items" label="Standard" v-model="imagerySet" class="half"></v-select>
    <v-switch v-model="switch1"></v-switch>
    <div class="wrapper">
      <div class="half" v-if="switch1">
        <h4>Road</h4>
        <div class="map">
          <vl-map
            :load-tiles-while-animating="true"
            :load-tiles-while-interacting="true"
            data-projection="EPSG:4326"
          >
            <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>
            <vl-feature>
              <vl-geom-point :coordinates="[ -5.571953101988551, 42.611645578129696 ]"></vl-geom-point>
            </vl-feature>
            <vl-feature>
              <vl-geom-point :coordinates="[ -15.78406528190429, 27.981543125196566 ]"></vl-geom-point>
            </vl-feature>
            <vl-feature>
              <vl-geom-line-string
                :coordinates="[[ -5.571953101988551, 42.611645578129696 ], [ -15.78406528190429, 27.981543125196566 ]]"
              ></vl-geom-line-string>
            </vl-feature>
            <vl-overlay id="overlay" :position="overlayCoordinate1">
              <template>
                <div>Mi casa</div>
              </template>
            </vl-overlay>
            <vl-overlay id="overlay2" :position="overlayCoordinate2">
              <template>
                <div>Casa de Fer</div>
              </template>
            </vl-overlay>
            <vl-feature>
              <vl-geom-circle
                :coordinates="[ -3.970022978154105, 40.407952426446315 ] "
                :radius="700000"
              ></vl-geom-circle>

              <vl-style-box>
                <vl-style-stroke color="blue"></vl-style-stroke>
                <vl-style-fill color="rgba(255,25,255,0.3)"></vl-style-fill>
                <!-- 0.3 de transparencia -->
                <vl-style-text text="La península"></vl-style-text>
              </vl-style-box>
            </vl-feature>

            <vl-geoloc @update:position="geolocPosition = $event">
              <template slot-scope="geoloc">
                <vl-feature v-if="geoloc.position" id="position-feature">
                  <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
                  <vl-style-box>
                    <vl-style-icon src="_media/marker.png" :scale="0.4" :anchor="[0.5, 1]"></vl-style-icon>
                  </vl-style-box>
                </vl-feature>
              </template>
            </vl-geoloc>

            <vl-layer-tile>
              <vl-source-osm></vl-source-osm>
            </vl-layer-tile>
            <!-- Esto es el tipo de mapa, puede ser 'sputnik'-->
          </vl-map>
        </div>
      </div>
      <div class="half">
        <h4>Aerial</h4>
        <div class="map">
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
        </div>
      </div>
    </div>
    <div class="half">
      <v-card color="purple lighten-4" width="600">
        <v-card-title>Coordenadas</v-card-title>
        <v-card-text>
          Zoom: {{ zoom }}
          <br />
          Center: {{ center }}
          <br />
          Rotation: {{ rotation }}
          <br />
          My geolocation: {{ geolocPosition }}
        </v-card-text>
      </v-card>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      zoom: 5,
      center: [-5.2, 41],
      rotation: 0,
      geolocPosition: undefined,
      overlayCoordinate1: [-5.571953101988551, 42.611645578129696],
      overlayCoordinate2: [-15.78406528190429, 27.981543125196566],
      maxZoom: 19,
      apiKey:
        "AljABXVYxUw9xFjAIFZIvjdgHaxgFConuMDkjLRsPLa1N4vMF2SMRN3BBJMGKdO6",
      imagerySet: "Aerial",
      items: ["Aerial", "AerialWithLabels", "RoadOnDemand", "CanvasDark"],
      switch1: true
    };
  },
  methods: {
    returnToLogin: function() {
      this.$router.push({
        name: "Login"
      });
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~ol/ol.css';

.map {
  width: 100%;
  height: 400px;
}

.wrapper {
  display: flex;
}

.half {
  padding: 0 10px;
  width: 50%;
  float: left;
}
</style> 