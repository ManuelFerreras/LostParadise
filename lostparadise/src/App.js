import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import './static/css/variables.css';
import './static/css/customFont.css';
import './static/css/normalize.css';
import './static/css/gloabals.css';
import './static/css/loader.css';
import './static/css/scrollbar.css';
import './static/css/utils.css';
import './static/css/faders.css';
import './static/css/social.css';
import './static/css/boton.css';
import './static/css/cards.css';
import './static/css/styles.css';
import './static/css/medias.css';

import './static/js/lostParadise_abi';
import './static/js/main';
import './static/js/scrollEffects';
import './static/js/hamburguer';
import './static/js/tilt';
import './static/js/smoothAnchorScroll';
import './static/js/buyIco';
import './static/js/particles';
import './static/js/particles-config';

import Cargador from './components/Cargador';
import Social from './components/Social';
import Header from './components/Header';
import Encabezado from './components/Encabezado';
import Content from './components/Content';

function App() {


  const particlesInit = async (main) => {
    console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(tsParticles);
  };

  const particlesLoaded = (container) => {
    console.log(container);
  };


  return (
    <>

      <Cargador />

      <div className='contenido-pagina'>

        <Social />
        <Header />
        <Encabezado />
        <Content />
        <Particles id="tsparticles" url={particlesConfig} init={particlesInit} loaded={particlesLoaded} />

      </div>

    </>
  );
}

export default App;
