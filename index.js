const URL = 'https://e3bzj7x3ck.execute-api.eu-west-1.amazonaws.com/v1';

new Vue({
  data() {
    return {
      title: 'Challenge 1',
      body: 'Really hard challenge',
      date: '',
      img: '',
    }
  },

  computed: {
    dateAsUnix() {
      return new Date(this.date).getTime() || undefined;
    },
    
    canSave() {
      return this.title !== ''
        && this.body !== ''
        && this.dateAsUnix !== ''
        && this.img !== ''
    }
  },

  methods: {
    fileUpload(event) {
      const [file] = event.target.files;

      const reader = new FileReader();

      reader.onloadend = () => {
        const imgAsB64 = reader.result.replace(/^data:.+;base64,/, '');

        this.img = imgAsB64;
      }

      reader.readAsDataURL(file);
    },

    async submitForm(event) {
      const result = await fetch(`${URL}/challenges`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: this.title,
          body: this.body,
          img: this.img,
          date: this.dateAsUnix,
        }),
      }).catch(console.error);
      
      
      console.info(await result.json());
    }
  },
}).$mount('#app');