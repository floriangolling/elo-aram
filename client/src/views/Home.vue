<template>
  <div id="nav">
    <nav
      class="navbar is-transparent"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <div
          class="navbar-burger"
          v-on:click="showNav = !showNav"
          v-bind:class="{ 'is-active': showNav }"
          data-target="navbarExampleTransparentExample"
          aria-expanded="false"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div
        id="navbarExampleTransparentExample"
        class="navbar-menu"
        v-bind:class="{
          'is-active': showNav,
          'fancy-border': showNav,
          myNavMenu: showNav,
        }"
      >
        <div class="navbar-end league-text small-text">
          <a class="navbar-item" href="#nav">
            <span class="icon">
              <i class="fas fa-info"></i>
            </span>
            <span class="lc">SEARCH</span>
          </a>
          <a class="navbar-item" href="#services">
            <span class="icon">
              <i class="fas fa-bars"></i>
            </span>
            <span class="lc">INFORMATIONS</span>
          </a>
        </div>
      </div>
    </nav>
    <section class="section mt-6" id="about">
      <div class="section-heading">
        <h3 class="title is-2 league-text lc">ELO ARAM</h3>
        <h4 class="subtitle is-5 league-text lc">
          Your favorite elo's tracking tool.
        </h4>
        <div class="container mb-6 league-text small-text text-ligher">
          <p>
            EloAram is a tool to track your current level in aram and that of
            your friends, you can also access various resources to get to know
            you better. Find your most played champions, their win rate, or your
            best friend of aram..
          </p>
        </div>
      </div>
      <div class="columns has-same-height is-gapless">
        <div class="column"></div>
        <div class="column mt-4 is-two-fifths">
          <div class="card pt-6 fancy-border" style="background-color: #040e18">
            <div class="card-content">
              <h3 class="title is-4 league-text lc">SEARCH PROFILE</h3>

              <div class="content mt-6">
                <div class="container">
                  <b-field label="">
                    <b-input v-model="username" class="is-centered"></b-input>
                  </b-field>
                </div>
                <b-button
                  @click="getUser"
                  class="league-text small-text mb-5 mt-5"
                  style="
                    background-color: #040e18;
                    color: #785a28;
                    border-color: #785a28;
                  "
                >
                  Search
                </b-button>
              </div>
              <table
                class="container table-profile league-text small-text mt-4 small-text-iphone"
                style="text-align: left"
              >
                <tr>
                  <td>WINRATE:</td>
                  <td>{{ this.winrate }}</td>
                </tr>
                <tr>
                  <td>GAMES:</td>
                  <td>{{ this.games }}</td>
                </tr>
                <tr>
                  <td>RANK:</td>
                  <td>{{ this.mmr }}</td>
                </tr>
                <tr>
                  <td>KDA AVERAGE:</td>
                  <td>{{ this.kda }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="column"></div>
      </div>
    </section>
    <section class="section" id="services">
      <div class="section-heading mb-6">
        <h3 class="title is-4 league-text lc">MORE INFORMATIONS</h3>
        <h4 class="subtitle is-5 has-text-white league-text">
          Your personal stats on your favorite champions.
        </h4>
      </div>
      <div class="container">
        <div id="chart" class="mb-6">
          <apexchart
            ref="realtimeChart"
            class="testChart fancy-border"
            type="line"
            height="350"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </div>
        <div class="columns has-same-height">
          <div class="column mt-4 is-one-quarter">
            <div
              class="card pl-6 pr-6 pt-6 fancy-border"
              style="background-color: #040e18"
            >
              <div class="card-content">
                <h3 class="title is-4 league-text lc">BEST CHAMP</h3>
                <div class="content">
                  <div class="h3 lc is-6">Name:</div>
                  <div
                    class="h3 lc is-6"
                    style="font-weight: 800; font-size: 1rem"
                  >
                    {{ this.maxPlayedChamp.championName }}
                  </div>
                  <div class="h3 mt-2">Played</div>
                  <div class="h3 mt-4">
                    {{ this.maxPlayedChamp.games }} games.
                  </div>
                  <div class="h3">
                    {{ this.maxPlayedChamp.winrate }}% winrate
                  </div>
                </div>
                <br />
              </div>
            </div>
          </div>
          <div class="column mt-4">
            <div
              class="card pt-6 fancy-border"
              style="background-color: #040e18"
            >
              <div class="card-content">
                <h3 class="title is-4 league-text lc">CHAMPIONS STATS</h3>
                <div class="content">
                  <div class="select">
                    <select v-model="actualChampion" @change="changeChampion">
                      <option>Select Champion</option>
                      <option
                        v-for="champion in championGames"
                        v-bind:key="champion.championName"
                      >
                        {{ champion.championName }}
                      </option>
                    </select>
                  </div>
                  <table
                    class="table-profile league-text small-text mt-6 small-text-iphone"
                    style="text-align: left"
                  >
                    <tr>
                      <td>WINRATE:</td>
                      <td>{{ this.selectedChampion.winrate }}</td>
                    </tr>
                    <tr>
                      <td>GAMES:</td>
                      <td>{{ this.selectedChampion.games }}</td>
                    </tr>
                    <tr>
                      <td>KDA AVERAGE:</td>
                      <td>{{ this.selectedChampion.kda }}</td>
                    </tr>
                  </table>
                </div>
                <br />
              </div>
            </div>
          </div>
          <div class="column mt-4 is-one-quarter">
            <div
              class="card pl-6 pr-6 pt-6 fancy-border"
              style="background-color: #040e18"
            >
              <div class="card-content">
                <h3 class="title is-4 league-text lc">BEST DUOQ</h3>
                <div class="content">
                  <div class="h3 lc is-6">Name:</div>
                  <div
                    class="h3 lc is-6"
                    style="font-weight: 800; font-size: 1rem"
                  >
                    {{ this.mostPlayedWith.username }}
                  </div>
                  <div class="h3 mt-2">Played</div>
                  <div class="h3 mt-4">
                    {{ this.mostPlayedWith.played }} games together.
                  </div>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div
        class="has-text-centered league-text lc"
        style="font-weight: 800; font-size: 0.9rem"
      >
        Made by @floriangolling
      </div>
    </section>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import axios from "axios";

export default {
  name: "Home",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      showNav: false,
      maxPlayedChamp: {
        games: "0",
        winrate: "?",
        championName: "?",
      },
      mostPlayedWith: {
        username: "?",
        played: "0",
      },
      actualChampion: "Select Champion",
      selectedChampion: {
        kda: "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002",
        winrate: "",
        games: "",
      },
      championGames: [],
      username: "",
      winrate: "",
      mmr: "",
      games: "",
      kda: "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002",
      series: [
        {
          name: "Winrate",
          data: ["0"],
        },
      ],
      chartOptions: {
        colors: ["#785a28", "#785a28", "#785a28"],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "Overall winrate",
          align: "middle",
          style: {
            fontSize: "18px",
            fontWeight: 600,
            fontFamily: "Friz Quadrata",
          },
        },
        markers: {
          colors: ["#cccccc"],
        },
        grid: {
          row: {
            colors: ["transparent"],
          },
          column: {
            colors: ["transparent"],
          },
          xaxis: {},
          yaxis: {},
        },
        xaxis: {
          labels: {
            show: true,
            style: {
              fontSize: "14px",
              fontWeight: 600,
            },
            offsetY: 5,
          },
          categories: [],
          tickAmount: 10,
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              fontSize: "14px",
              fontWeight: 600,
            },
          },
          max: 100,
          min: 0,
        },
      },
    };
  },
  methods: {
    async getUser() {
      try {
        const request = await axios.get(
          "http://35.180.98.93:8080/api/user/" + this.username.toLowerCase()
        );
        const { data } = request;
        this.winrate = Math.trunc(data.winrate) + "%";
        this.games = data.games;
        this.mmr = this.getRank(data.elo);
        this.kda =
          data.totalKda.kills.toFixed(1) +
          "/" +
          data.totalKda.deaths.toFixed(1) +
          "/" +
          data.totalKda.assists.toFixed(1);
        let mySeries = [{ name: "Winrate", data: data.winrates }];
        this.mostPlayedWith = data.mostPlayedWith;
        this.championGames = data.championsWinrate;
        this.maxPlayedChamp = data.maxPlayedChamp;
        this.maxPlayedChamp.winrate = Math.trunc(this.maxPlayedChamp.winrate);
        this.$refs.realtimeChart.updateSeries(mySeries, true);
      } catch (error) {
        console.log(error);
      }
    },
    async changeChampion() {
      let myChampion = this.championGames.filter(
        (elem) => elem.championName == this.actualChampion
      )[0];
      let newSelectedChampion = {
        kda:
          myChampion.kills.toFixed(1) +
          "/" +
          myChampion.deaths.toFixed(1) +
          "/" +
          myChampion.assists.toFixed(1),
        winrate: myChampion.winrate.toFixed(1) + "%",
        games: myChampion.games.toFixed(1),
      };
      this.selectedChampion = newSelectedChampion;
    },
    getRank(mmr) {
      if (mmr < 100) {
        return "Iron V";
      }
      if (mmr < 200) {
        return "Iron IV";
      }
      if (mmr < 300) {
        return "Iron III";
      }
      if (mmr < 200) {
        return "Iron II";
      }
      if (mmr < 500) {
        return "Iron I";
      }
      if (mmr < 540) {
        return "Bronze V";
      }
      if (mmr < 580) {
        return "Bronze IV";
      }
      if (mmr < 620) {
        return "Bronze III";
      }
      if (mmr < 660) {
        return "Bronze II";
      }
      if (mmr < 700) {
        return "Bronze I";
      }
      if (mmr < 760) {
        return "Silver V";
      }
      if (mmr < 820) {
        return "Silver IV";
      }
      if (mmr < 880) {
        return "Silver III";
      }
      if (mmr < 940) {
        return "Silver II";
      }
      if (mmr < 1000) {
        return "Silver I";
      }
      if (mmr < 1060) {
        return "Gold V";
      }
      if (mmr < 1120) {
        return "Gold IV";
      }
      if (mmr < 1180) {
        return "Gold III";
      }
      if (mmr < 1240) {
        return "Gold II";
      }
      if (mmr < 1300) {
        return "Gold I";
      }
      if (mmr < 1380) {
        return "Platinum V";
      }
      if (mmr < 1460) {
        return "Platinum IV";
      }
      if (mmr < 1540) {
        return "Platinum III";
      }
      if (mmr < 1620) {
        return "Platinum II";
      }
      if (mmr < 1700) {
        return "Platinum I";
      }
      if (mmr < 1740) {
        return "Diamond V";
      }
      if (mmr < 1780) {
        return "Diamond IV";
      }
      if (mmr < 1820) {
        return "Diamond III";
      }
      if (mmr < 1860) {
        return "Diamond II";
      }
      if (mmr < 1900) {
        return "Diamond I";
      }
      if (mmr >= 1900 && mmr < 2300) {
        return "Master";
      }
      if (mmr >= 2300) return "Challenger";
    },
  },
};
</script>

<style lang="scss">
.league-text {
  font-weight: 500;
  font-size: 2.5rem;
  letter-spacing: 0.25rem;
  color: #785a28;
}

.lc {
  color: #785a28 !important;
}

.testChart {
  background-color: #cccccc !important;
}

.navbar-menu.myNavMenu {
  background-color: #040e18 !important;
}

.l {
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.25rem;
  color: #785a28;
}

.text-ligher {
  color: #ffffff;
}

$input-hover-color: black;
$input-focus-color: black;

.input {
  background-color: #cccccc !important;
  text-align: center;
  border: none !important;
}

.select:not(.is-multiple):not(.is-loading)::after {
  border-color: #785a28 !important;
}

.select select {
  background-color: #040e18 !important;
  color: #785a28 !important;
  border-color: #785a28 !important;
  font-family: "Friz Quadrata" !important;
  font-weight: 400 !important;
}

.small-text {
  font-size: 1rem;
}

body {
  background-image: url("../assets/bg.jpg");
}

html {
  background-color: transparent !important;
}

.navbar {
  background-color: transparent !important;
}

.fancy-border {
  border: 25px solid #785a28;
  border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='75' height='75'%3E%3Cg fill='none' stroke='%23B88846' stroke-width='2'%3E%3Cpath d='M1 1h73v73H1z'/%3E%3Cpath d='M8 8h59v59H8z'/%3E%3Cpath d='M8 8h16v16H8zM51 8h16v16H51zM51 51h16v16H51zM8 51h16v16H8z'/%3E%3C/g%3E%3Cg fill='%23B88846'%3E%3Ccircle cx='16' cy='16' r='2'/%3E%3Ccircle cx='59' cy='16' r='2'/%3E%3Ccircle cx='59' cy='59' r='2'/%3E%3Ccircle cx='16' cy='59' r='2'/%3E%3C/g%3E%3C/svg%3E")
    25;
}

table td {
  color: #cccccc;
  border: 1px solid #785a28 !important;
  padding: 0.5rem 0.2rem 0.5rem 0.4rem;
}

@media (max-width: 1250px) {
  table td {
    padding: 0.5rem 0.2rem 0.2rem 0.2rem;
  }
}

@media (max-width: 1250px) {
  .small-text-iphone {
    font-size: 0.75rem;
  }
}
</style>
