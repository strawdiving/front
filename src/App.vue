<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: 'App',
  components: {
  },
  computed: {
    status() {
      return this.$store.state.status
    }
  },
  methods: {
  },
  mounted() {
    let self = this;
    var socket = io("http://192.168.0.3:3000");
    // socket.on("message", function(data) {
    //   // console.log(data)
    //   self.$store.commit("updateState", data);
    // });
    socket.on("status", (data) => {
      // if (!this._.isEqual(data, this.status)) {
      //   self.$store.commit("updateState", data);
      // }
      self.$store.commit("updateState", data);
    })
    socket.on("config", (data) => {
      self.$store.commit('updateSetValue', data)
      console.log(data)
    })

    socket.on('disconnect', (reason)=>{
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
      }
    })
    socket.on('connect_error', (err) => {
      console.log(err)
    })
    
  }
}
</script>

<style>
body {
  margin-top: 0px;
  padding: 0px;
  margin: 0px;
  background-color: #f1f2f7;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
