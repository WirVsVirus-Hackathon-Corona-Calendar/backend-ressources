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
    }
  },
}).$mount('#app');