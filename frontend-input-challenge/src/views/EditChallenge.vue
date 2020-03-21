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

      <v-text-field
        v-model="ebody"
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
            v-model="edate"
            label="Tag auswählen"
            append-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="edate" @input="menu = false"></v-date-picker>
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

  props: ['id', 'title', 'body', 'img', 'dateStart'],

  data() {
    return {
      menu: false,

      eid: this.id,
      etitle: this.title,
      ebody: this.body,
      eimg: this.img,
      edate: this.dateStart,
    };
  },

  computed: {
    dateAsUnix() {
      return new Date(this.edate).getTime() || undefined;
    },

    canSave() {
      return this.etitle !== ''
        && this.ebody !== ''
        && this.edateAsUnix !== ''
        && this.eimg !== '';
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

        this.eimg = imgAsB64;
      };

      reader.readAsDataURL(file);
    },

    async save() {
      /* eslint-disable no-alert */
      const resp = await fetch(`${this.$URL}/challenges`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: this.etitle,
          body: this.ebody,
          img: this.eimg,
          date: this.edateAsUnix,
        }),
      }).catch(console.error);

      if (!resp) {
        alert('Something went wrong, try again.');
      } else {
        alert('Successfully edited challenge.');
        this.$router.push({ name: 'ListChallenges' });
      }
    },
  },
};
</script>

<style>
</style>
