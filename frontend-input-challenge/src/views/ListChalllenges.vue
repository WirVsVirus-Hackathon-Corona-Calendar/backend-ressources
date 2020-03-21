<template>
  <v-data-table
      :headers="headers"
      :items="data"
      item-key="data.id"
      :sort-by="[]"
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
          text: 'Datum', align: 'left', sortable: true, value: 'dateStart', width: '160',
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
      const resp = await fetch(`${this.$URL}/challenges`).catch(console.error);

      if (!resp) {
        alert('Could not load challenges.');
      }

      const data = await resp.json();

      this.data = data.length > 0 ? data.map(
        ({
          // eslint-disable-next-line camelcase
          id, title, body, date_start, img,
        }) => ({
          id, title, body, dateStart: new Date(date_start).toLocaleString(), img,
        }),
      ) : [];
    },

    editItem(item) {
      console.info(item);
      this.$router.push({
        name: 'EditChallenge',
        params: item,
      });
    },

    async deleteItem(item) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm('Are you sure you want to delete this item?')) {
        const resp = await fetch(`${this.$URL}/challenges/${item.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
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
