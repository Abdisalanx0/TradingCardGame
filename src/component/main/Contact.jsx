import React from "react"
import "../../css/page/Home.css"
const Contact = () => {
  return (
    <div id="contact" class="background">
      <div class="container">
        <div class="screen">
          <div class="screen-header">
            <div class="screen-header-left">
              <div class="screen-header-button close"></div>
              <div class="screen-header-button maximize"></div>
              <div class="screen-header-button minimize"></div>
            </div>
            <div class="screen-header-right">
              <div class="screen-header-ellipsis"></div>
              <div class="screen-header-ellipsis"></div>
              <div class="screen-header-ellipsis"></div>
            </div>
          </div>
          <div class="screen-body">
            <div class="screen-body-item left">
              <div class="app-title">
                <span>CONTACT</span>
                <span>US</span>
                <img
                  class="contact-image"
                  src="/graphics/smartest-pokemon.png"
                ></img>
              </div>
            </div>
            <div class="screen-body-item">
              <div class="app-form">
                <div class="app-form-group">
                  <input class="app-form-control" placeholder="NAME"></input>
                </div>
                <div class="app-form-group">
                  <input class="app-form-control" placeholder="EMAIL"></input>
                </div>
                <div class="app-form-group">
                  <input
                    class="app-form-control"
                    placeholder="CONTACT NO"
                  ></input>
                </div>
                <div class="app-form-group message">
                  <input class="app-form-control" placeholder="MESSAGE"></input>
                </div>
                <div class="app-form-group buttons">
                  <button class="app-form-button">CANCEL</button>
                  <button class="app-form-button">SEND</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact
