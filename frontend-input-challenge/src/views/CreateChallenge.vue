<template>
  <div>
    <h2>Neue Challenge anlegen</h2>
    <v-form
      ref="form"
    >
      <v-text-field
        v-model="title"
        label="Titel"
        required
      ></v-text-field>

      <v-text-field
        v-model="body"
        label="Body"
        required
      ></v-text-field>

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
export default {
  name: 'CreateChallenge',

  data() {
    return {
      loading: false,

      title: 'Challenge 1',
      body: 'Really hard challenge',
      img: '',
    };
  },

  computed: {
    canSave() {
      return this.title !== '' && this.body !== '' && this.img !== '';
    },
  },

  methods: {
    fileUpload(event) {
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

      const result = await this.$http.put('/challenges', {
        title: this.title,
        body: this.body,
        img: this.img,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$token}`,
        },
      }).catch(console.error);

      if (!result) {
        alert('Something went wrong, try again.');
      } else {
        alert('Successfully saved challenge.');
        this.title = '';
        this.body = '';
        this.date = '';
        this.img = '';
        this.$refs.img.reset();
      }

      this.loading = false;
    },
  },
};
</script>
