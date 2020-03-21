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

      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            label="Tag auswählen"
            append-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
      </v-menu>

      <v-btn
        :disabled="!canSave"
        color="secondary"
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
      menu: false,

      title: 'Challenge 1',
      body: 'Really hard challenge',
      img: '',
      date: new Date().toISOString().substr(0, 10),
    };
  },

  computed: {
    dateAsUnix() {
      return new Date(this.date).getTime() || undefined;
    },

    canSave() {
      return this.title !== ''
        && this.body !== ''
        && this.dateAsUnix !== ''
        && this.img !== '';
    },
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

      const result = await fetch(`${this.$URL}/challenges`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: this.title,
          body: this.body,
          img: this.img,
          date: this.dateAsUnix,
        }),
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
    },
  },
};
</script>

<style>
</style>
