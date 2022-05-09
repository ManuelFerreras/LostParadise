import React from "react";

function Content() {
    return(
        <>

            <div class="relative">
                <div id="particles" style="position:absolute;top:0;bottom:0;left:0;right:0;"></div>
                <div class="contenedor">
                    
                    <div class="contenedor info outOfScreen">
                        <h3 class="slide-in from-left">Build</h3>

                        <p class="slide-in from-right">Build your dream Tycoon Empire!</p>
                    </div>
                </div>
            </div>

            <div class="fondo-secundario outOfScreen">
                <div class="contenedor info reverse">
                    <h3 class="slide-in from-right">Upgrade</h3>

                    <p class="slide-in from-left">Upgrade your buildings to maximise your earnings!</p>
                </div>
            </div>

            <div class="relative">
                <div id="particles2" style="position:absolute;top:0;bottom:0;left:0;right:0;"></div>
                <div class="contenedor outOfScreen">
                    <div class="contenedor info">
                        <h3 class="slide-in from-left">Combine</h3>

                        <p class="slide-in from-right">Combine buildings to get new and better ones!</p>
                    </div>
                </div>
            </div>


            <main class="lore" id="about">
                <div class="content contenedor">
                    <h3 class="shadowing fade-in">About</h3>

                    <p  class="fade-in">Lost Paradise is the first Crypto Tycoon game where you earn what you produce! Get yourself some nfts and start building your Tycoonist Empire! Upgrade, Combine, and Manage your own Cities!</p>
                </div>  
            </main> 

        </>
    );
}

export default Content;