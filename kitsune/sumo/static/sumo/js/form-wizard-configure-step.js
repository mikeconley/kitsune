import { BaseFormStep } from "sumo/js/form-wizard";
import infoImageURL from "sumo/img/info.svg";
import keyImageURL from "sumo/img/key.svg";
import notSyncingImageURL from "sumo/img/not-syncing.svg";
import syncingImageURL from "sumo/img/syncing.svg";
import configureStepStylesURL from "../scss/form-wizard-configure-step.styles.scss";

export class ConfigureStep extends BaseFormStep {
  get template() {
    return `
      <template>
        <div class="configure-step-wrapper">
          <p id="header">
            <img class="icon" src="${infoImageURL}" aria-hidden="true"></img>
            <span>${gettext("You are now signed in to your Mozilla account")}</span>
          </p>

          <div id="sync-status-container">
            <img class="not-syncing icon" src="${notSyncingImageURL}" aria-hidden="true"></img>
            <img class="syncing icon" src="${syncingImageURL}" aria-hidden="true"></img>
            <h3 class="not-syncing">${gettext("Update browser settings")}</h3>
            <h3 class="syncing">${gettext("Data syncing...")}</h3>
          </div>

          <ul id="instructions">
            <li class="not-syncing">
              ${gettext("We were unable to sync your data. To complete this backup, you’ll need to turn on syncing. <a href='#'>Go to settings</a>")}
            </li>

            <li class="syncing">
              ${gettext("If you need to make any changes to the data you want synced, you can do so at any time in your <a href='#'>browser settings.</a>")}
            </li>
          </ul>

          <p class="warning for-sign-up">
            <img class="key-icon" src="${keyImageURL}" aria-hidden="true"></img>
            <span>
              ${interpolate(
                gettext("Take a minute to create an <a href='%s'>account recovery key</a>, so you won’t get locked out if you lose your password."),
                ["/kb/reset-your-firefox-account-password-recovery-keys#w_generate-and-store-your-account-recovery-key"]
              )}
            </span>
          </p>

          <p id="buttons">
            <button id="next" class="mzp-c-button mzp-t-product" data-event-category="device-migration-wizard" data-event-action="click" data-event-label="configuration-next">${gettext("Continue")}</button>
          </p>
        </div>
      </template>
    `;
  }

  get styles() {
    let linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = configureStepStylesURL;
    return linkEl;
  }

  connectedCallback() {
    super.connectedCallback();
    let buttons = this.shadowRoot.querySelector("#buttons");
    buttons.addEventListener("click", this);

    let notSyncingInstructionLink = this.shadowRoot.querySelector("#instructions > .not-syncing > a");
    notSyncingInstructionLink.id = "turn-on-sync";

    let syncingInstructionLink = this.shadowRoot.querySelector("#instructions > .syncing > a");
    syncingInstructionLink.id = "change-sync-prefs";

    for (let link of [notSyncingInstructionLink, syncingInstructionLink]) {
      link.addEventListener("click", this);
      link.dataset.eventCategory = "device-migration-wizard";
      link.dataset.eventAction = "click";
      link.dataset.eventLabel = link.id;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    let buttons = this.shadowRoot.querySelector("#buttons");
    buttons.removeEventListener("click", this);
  }

  render(prevState, state) {
    if (this.state.syncEnabled !== prevState.syncEnabled) {
      let statusContainerEl = this.shadowRoot.getElementById("sync-status-container");
      statusContainerEl.toggleAttribute("sync-enabled", this.state.syncEnabled);

      let buttons = this.shadowRoot.getElementById("buttons");
      buttons.toggleAttribute("sync-enabled", this.state.syncEnabled);
      let nextButton = this.shadowRoot.getElementById("next");
      nextButton.disabled = !this.state.syncEnabled;
      let instructions = this.shadowRoot.getElementById("instructions");
      instructions.toggleAttribute("sync-enabled", this.state.syncEnabled);
    }
  }

  handleEvent(event) {
    switch (event.target.id) {
      case "turn-on-sync": {
        this.dispatch("DeviceMigrationWizard:ConfigureStep:TurnOnSync");
        break;
      }
      case "change-sync-prefs": {
        this.dispatch("DeviceMigrationWizard:ConfigureStep:ChangeSyncPrefs");
        break;
      }
      case "next": {
        this.dispatch("DeviceMigrationWizard:ConfigureStep:Next");
        break;
      }
    }
  }

  dispatch(eventName) {
    let event = new CustomEvent(eventName, { bubbles: true });
    this.dispatchEvent(event);
  }
}

customElements.define("configure-step", ConfigureStep);
