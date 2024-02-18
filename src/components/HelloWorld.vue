<template>
  <v-container>
    <v-row>
      <v-sheet width="300" class="mx-auto">
        <v-form @submit.prevent>
          <v-text-field v-model="temperature" type="number" label="Temperatur °C"></v-text-field>
          <v-btn type="submit" block class="mt-2" @click="submitTemperature">Absenden</v-btn>
        </v-form>
        <v-btn block class="mt-2" @click="dialog = true">Zyklus Start</v-btn>
      </v-sheet>
    </v-row>
  </v-container>

  <v-container>
    <v-row>
      <div class="chart-container">
        <canvas ref="canvas"></canvas>
      </div>
    </v-row>
  </v-container>

  <v-container>
    <v-row class="justify-center">
      <v-btn color="error" @click="dialogDelete = true">Eintrag löschen</v-btn>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog">
    <v-card>
      <v-card-text>
        Möchteset du einen neuen Zyklus starten?
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="startCycle">Ja</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="dialog = false">Close Dialog</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogDelete">
    <v-card>
      <v-card-text>
        Letzter Temperatureintrag löschen?
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="deleteLastTemperature">Ja</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="dialogDelete = false">Abbruch</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
//
</script>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    temperature: '',
    chartData: {
      labels: [],
      datasets: [{
        label: 'Temperatur °C',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointStyle: 'circle',
        pointRadius: 5,
        pointBackgroundColor: 'rgb(75, 192, 192)',
      }]
    },
    chartOptions: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true
        }
      },
      responsive: true,
      maintainAspectRatio: true
    },
    myChart: null // Zum Speichern der Chart-Instanz

  }),
  mounted() {
    this.loadData();
    this.renderChart();
  },
  methods: {
    deleteLastTemperature() {
      // Lade die gespeicherten Temperaturdaten
      let data = JSON.parse(localStorage.getItem('temperatureData')) || [];

      // Prüfe, ob Daten vorhanden sind
      if (data.length > 0) {
        // Entferne den letzten Eintrag aus dem Array
        data.pop();

        // Speichere das aktualisierte Array zurück im LocalStorage
        localStorage.setItem('temperatureData', JSON.stringify(data));

        // Aktualisiere die Daten im Diagramm
        this.loadData();
        this.renderChart();
      }

      // Schließe den Dialog
      this.dialogDelete = false;
    },
    startCycle() {
      const cycleStarts = JSON.parse(localStorage.getItem('cycleStarts')) || [];
      cycleStarts.push(new Date().getTime()); // Speichert den aktuellen Timestamp
      localStorage.setItem('cycleStarts', JSON.stringify(cycleStarts));

      this.dialog = false; // Schließt den Dialog

      // Löscht die aktuellen Daten im Diagramm und lädt die Daten neu
      this.chartData.labels = [];
      this.chartData.datasets[0].data = [];
      this.loadData();
      this.renderChart();
    },
    loadData() {
      const data = JSON.parse(localStorage.getItem('temperatureData')) || [];
      const cycleStarts = JSON.parse(localStorage.getItem('cycleStarts')) || [];
      const lastCycleStart = cycleStarts.length > 0 ? cycleStarts[cycleStarts.length - 1] : 0; // Verwende 0 als Fallback

      const filteredData = data.filter(item => item.timestamp >= lastCycleStart);

      this.chartData.labels = filteredData.map(item => item.label);
      this.chartData.datasets[0].data = filteredData.map(item => item.temperatur);
    },
    submitTemperature() {
      const timestamp = new Date().getTime(); // Aktuellen Timestamp holen
      const label = `${new Date(timestamp).getDate().toString().padStart(2, '0')}.${(new Date(timestamp).getMonth() + 1).toString().padStart(2, '0')}`;
      const temperatur = parseFloat(this.temperature);

      if (!isNaN(temperatur)) {
        const data = JSON.parse(localStorage.getItem('temperatureData')) || [];
        data.push({ label, temperatur, timestamp }); // Füge den Timestamp hinzu
        localStorage.setItem('temperatureData', JSON.stringify(data));

        this.temperature = ''; // Reset
        this.loadData();
        this.renderChart();
      }
    },

    renderChart() {
      if (this.myChart) {
        this.myChart.destroy();
      }

      const ctx = this.$refs.canvas.getContext('2d');
      this.myChart = new Chart(ctx, {
        type: 'line',
        data: this.chartData,
        options: this.chartOptions
      });
    }
  }
}
</script>

<style>
.chart-container {
  width: 100%;
  height: 400px;
  /* Definieren Sie eine feste Höhe für das Chart */
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>



<style>
.chart-conainter {
  width: 100%;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>