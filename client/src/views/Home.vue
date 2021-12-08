<template>

  <section class="hero is-fullheight has-background">
        <img class="hero-background" src='../assets/bg.jpg'>
        <div class="hero-head">
            <nav class="navbar">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="../">
                        </a>
                        <span class="navbar-burger burger" data-target="navbarMenu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </div>
                    <div id="navbarMenu" class="navbar-menu">
                        <div class="navbar-start has-text-centered league-text mt-3" style="font-size:1.2rem">
                          ELO ARAM
                        </div>
                        <div class="navbar-end">
                            <div class="tabs is-right">
                                <ul>
                                    <li><a href="" style="color:#785a28;border-bottom:1px solid">HOME</a></li>
                                    <li><a href="" style="color:#785a28;border-bottom: 1px solid">HELP</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
            </nav>
        </div>
        <div class="hero-body" style="height:100%">
            <div class="container has-text-centered" style="height:100%">
                <div class="columns is-centered">
                    <div class="column is-5 pt-6 pb-6" style="border: 1px solid #785a28;background-color:#010a13 ">
                        <div class="columns">
                          <div class="column is-centered">
                            <figure class="image is-128x128">
                                <img src="../assets/iron-1.png" alt="Description" class="mt-2" style="position:absolute;display:inline">
                            </figure>
                          </div>
                          <div class="column has-text-left league-text" style="font-size:1.75rem;font-weight:500; color:#785a28">
                            <div class="div is-centered has-text-left">
                                <div> Hekamo </div>
                                <div> Iron I </div>
                                <div> Winrate : 58% </div>
                                <div> Games : 19 </div>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="column is-6 is-offset-1">
                        <h1 class="title is-2">
                            Caca
                        </h1>
                        <h2 class="subtitle is-4">
                          PIpi
                        </h2>
                        <br>
                        <p class="has-text-centered">
                            <a class="button is-medium is-info is-outlined">
                                Crotte
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="hero-foot">
            <div class="container">
                <div class="tabs is-centered">
                    <ul>
                        <li><a class="l">@MADE BY FLORIAN.GOLLING@EPITECH.EU</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {
  },
};
</script>

<style lang="scss" scoped>

.league-text {
  font-weight: 500;
  font-size: 2.5rem;
  letter-spacing: 0.25rem;
  color: #785a28
}

.l {
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.25rem;
  color: #785a28 
}

.hero {
  &.has-background {
    position: relative;
    overflow: hidden;
  }
  &-background {
    position: absolute;
    object-fit: cover;
    object-position: center center;
    width: 100%;
    height: 100%;
    &.is-transparent {
      opacity: 0.3;
    }
  }
}
</style>
 