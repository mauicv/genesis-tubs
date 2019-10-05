<template>
  <div>
    <div class="topBar">
      <b-container class="bv-example-row">
        <b-row>
          <b-col></b-col>
          <b-col cols="8">
            <div class="title">
              <img
                alt="genesis-tubs logo"
                src="../assets/genesis-tub.png"
                height="80px"
                width="80px"
              />
              <span style="margin-left:20px;">Genesis Tubs</span>
            </div>
          </b-col>
          <b-col></b-col>
        </b-row>
        <b-row>
          <b-col></b-col>
          <b-col>
            <div id="nav">
              <div class="nav1">
                <router-link class="button1" to="/about">About</router-link>
                <router-link class="button1" to="/archive">Archive</router-link>
                <a href="https://ko-fi.com/genesistubs" class="button1"
                  >Fund Me</a
                >
              </div>
            </div>
          </b-col>
          <b-col></b-col>
        </b-row>
        <b-row>
          <b-col></b-col>
          <b-col cols="11">
            <div>
              <p>
                Genesis tubs is a reference to the Simpsons mini episode,
                <a href="https://en.wikipedia.org/wiki/Treehouse_of_Horror_VII">
                  <em>"The Genesis Tub"</em>
                </a>
                in "Treehouse of Horror VII" in which Lisa accidentally creates
                a tiny civilization in a tub by trying to dissolve her tooth in
                coke for a science fair project.
              </p>
              <p>
                I spent ages building a physics engine and then once I was done
                realised that I, nor for that matter anybody else would actually
                have any particular use for it. I'm not being self-depreciating
                here it's just that there are lots of professional level
                JavaScript physics engines and mines pretty amateur in
                comparison.
              </p>
              <p>
                To solve this problem I've made this site on which I'm hoping to
                update semi-regularly with short-duration "games". This way
                it'll occasionally be used by me rather than forever sitting
                around in a GitHub repository. Games is in quotation marks
                because I'm not sure that's what they are...
              </p>
              <p>
                It's in a GitHub repository
                <a href="https://github.com/mauicv/genesis-tubs-engine">
                  <em>here</em> </a
                >. However be warned if your thinking about using it the
                documentation is very much lacking. This is mostly because it
                felt a bit sad to write instructions that nobody would ever
                read.
              </p>
              <p>
                I've also created a vue-electron app that I use to create the
                environments which the engine simulates. This is contained in a
                GitHub repository
                <a href="https://github.com/mauicv/genesis-tubs-builder">
                  <em>here</em> </a
                >. Again note that this project is poorly and only sporadically
                maintained.
              </p>
              <p>
                All the content is created by me. Including the music and
                background images. Feel free to email me any suggestions or
                praise at genesis.tub@gmail.com. I am, however notoriously bad
                at responding to and reading things so expect to be ignored.
              </p>
              <p>
                Finally if you enjoyed the content then consider
                <a href="https://ko-fi.com/genesistubs">
                  <em>funding me</em>
                </a>
                though please don't feel in anyway obligated to do so.
              </p>
            </div>
          </b-col>
          <b-col></b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<style scoped>
p {
  text-align: center;
  font-size: 14px;
  width: 70%;
  margin: auto;
  padding: 5px;
}
</style>
