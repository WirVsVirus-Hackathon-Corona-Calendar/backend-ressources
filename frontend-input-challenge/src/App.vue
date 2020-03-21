<template>
  <v-app>
    <!-- HEADER -->
    <v-app-bar
      app
      clipped-left
      color="#9BC1BC"
      dark
    >
      <v-toolbar-title>Corona Calender - Challenges</v-toolbar-title>
    </v-app-bar>

    <!-- SIDEBAR  -->
    <v-navigation-drawer
      app
      clipped
      permanent
      color="#9BC1BC"
      dark
      width="150"
    >
      <v-list>
        <v-list-item
          v-for="route in routes"
          :key="route.title"
          @click="$router.push(route.route)"
        >
          <v-list-item-action>
            <v-list-item-title>{{ route.title }}</v-list-item-title>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- CONTENT -->
    <v-content>
      <v-container fluid>
        <!-- INJECTION OF THE VIEW -->
        <Router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      // Routes are defined with title and route
      routes: [
        { title: 'Liste', route: '/' },
        { title: 'Anlegen', route: '/create' },
      ],
    };
  },
};
</script>
