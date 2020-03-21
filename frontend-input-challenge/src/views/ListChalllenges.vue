<template>
  <v-data-table
      :headers="headers"
      :items="data"
      item-key="data.id"
      sort-by="order"
      multi-sort
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          delete
        </v-icon>
      </template>
    </v-data-table>
</template>

<script>
/* eslint-disable no-alert */

export default {
  name: 'ListChallenges',

  data() {
    return {
      data: [],

      search: '',

      headers: [
        {
          text: 'Nr', align: 'left', sortable: true, value: 'order', width: '100',
        },
        {
          text: 'Titel', align: 'left', sortable: true, value: 'title',
        },
        {
          text: 'Body', align: 'left', sortable: true, value: 'body',
        },
        {
          text: 'Actions', value: 'actions', sortable: false,
        },
      ],
    };
  },

  async created() {
    this.loadChallenges();
  },

  methods: {
    async loadChallenges() {
      const resp = await this.$http.get('/challenges').catch(console.error);

      if (!resp) {
        alert('Could not load challenges.');
      }

      const { data } = resp;

      // Transform data
      this.data = data.length > 0 ? data.map(
        ({
          /* eslint-disable camelcase */
          id,
          order,
          title,
          body,
          icon_url,
        }) => ({
          id,
          order,
          title,
          body,
          iconUrl: icon_url,
        }),
      ) : []; // Save response
    },

    editItem(item) {
      this.$router.push({
        name: 'EditChallenge',
        params: item,
      });
    },

    async deleteItem(item) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm('Are you sure you want to delete this challenge?')) {
        const resp = await this.$http.delete(`/challenges/${item.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$token}`,
          },
        }).catch(console.error);

        if (!resp) {
          alert('Something went wrong, try again.');
          return;
        }

        this.loadChallenges();
      }
    },
  },
};
</script>

<style>
</style>
