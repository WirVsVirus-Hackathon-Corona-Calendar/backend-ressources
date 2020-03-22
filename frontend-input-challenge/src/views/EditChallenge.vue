<template>
  <div>
    <h2>Challenge bearbeiten</h2>
    <v-form
      ref="form"
    >
      <v-text-field
        v-model="etitle"
        label="Titel"
        required
      ></v-text-field>

      <v-textarea
        v-model="ebody"
        label="Body"
        required
      ></v-textarea>

      <v-img
        :src="iconUrl"
        max-height="200"
        max-width="200"
      ></v-img>

      <v-file-input
        ref="img"
        accept="image/*"
        multiple label="Bild hochladen"
        append-icon="attach_file"
        prepend-icon=""
        @change="fileUpload"
      ></v-file-input>

      <v-btn
        :disabled="!canSave"
        color="secondary"
        :loading="loading"
        class="mr-4"
        @click="save"
      >
        Speichern
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditChallenge',

  props: ['id', 'order', 'title', 'body', 'iconUrl'],

  data() {
    return {
      menu: false,
      loading: false,

      etitle: this.title,
      ebody: this.body,
      img: '',
    };
  },

  computed: {
    canSave() {
      return this.etitle !== '' && this.ebody !== '' && this.img !== '';
    },
  },

  async created() {
    /* eslint-disable no-alert */
    // Use axios to prevent using baseUrl
    const resp = await axios.get(
      this.iconUrl,
      { responseType: 'arraybuffer' },
    ).catch(console.error);

    if (!resp) {
      alert('Could not fetch icon');

      // Return to list of challenges
      this.$router.push({ name: 'ListChallenges' });
      return;
    }

    const data = Buffer.from(resp.data, 'binary').toString('base64');

    this.img = data;
  },

  methods: {
    fileUpload(event) {
      console.info(event);

      const [file] = event;

      if (!file) return;

      const reader = new FileReader();

      reader.onloadend = () => {
        const imgAsB64 = reader.result.replace(/^data:.+;base64,/, '');

        this.img = imgAsB64;
      };

      reader.readAsDataURL(file);
    },

    async save() {
      /* eslint-disable no-alert */
      this.loading = true;

      const resp = await this.$http.patch(`/challenges/${this.id}`, {
        order: this.order,
        title: this.etitle,
        body: this.ebody,
        img: this.img,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$token}`,
        },
      }).catch(console.error);

      if (!resp) {
        alert('Something went wrong, try again.');
      } else {
        alert('Successfully edited challenge.');
        this.$router.push({ name: 'ListChallenges' });
      }

      this.loading = false;
    },
  },
};
</script>

<style>
</style>
