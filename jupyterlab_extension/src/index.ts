import { JupyterLab, JupyterLabPlugin } from "@jupyterlab/application";

import { INotebookTracker } from "@jupyterlab/notebook";

import { ICommandPalette } from "@jupyterlab/apputils";

/**
 * swanLogo
 */
class swanLogo {
  app: JupyterLab;
  tracker: INotebookTracker;
  palette: ICommandPalette;
  swanLogo_replace: boolean = true;
  lastHTML: string;

  constructor(
    app: JupyterLab,
    tracker: INotebookTracker,
    palette: ICommandPalette
  ) {
    this.app = app;
    this.tracker = tracker;
    this.palette = palette;
    this.setup_button();
    this.tracker.activeCellChanged.connect(this.onActiveCellChanged, this);
  }
  replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(find, "g"), replace);
  }

  add_image(text: string): string {
    let html = text;
    let img_src =
      "https://swan.web.cern.ch/sites/swan.web.cern.ch/files/pictures/logo_swan_cloudhisto.png"; // loads image path

    html = this.replaceAll(
      html,
      "SWAN",
      "<img class='swan_logo' style='display: inline; margin-top: 0em; height: 1em;' src='" +
        img_src +
        "'>"
    ); //replaces all the word 'swan' with the image

    return html;
  }

  onActiveCellChanged(): void {
    let active_cell = this.tracker.activeCell;

    if (active_cell !== null && active_cell.model.type == "markdown") {
      let editor_temp: any = active_cell.editor;
      let editor: any = editor_temp._editor;
      let current_mode: string = editor.getOption("mode");

      if (current_mode == "null") {
        return;
      }

      if (
        this.swanLogo_replace &&
        active_cell.node.innerHTML != this.lastHTML
      ) {
        console.log(active_cell);
        active_cell.node.innerHTML = this.add_image(active_cell.node.innerHTML);
        this.lastHTML = active_cell.node.innerHTML;
        return;
      }
      return;
    }
  }

  toggle_logoReplace() {
    this.swanLogo_replace = !this.swanLogo_replace;
    console.log("Replacing logo is currently: ", this.swanLogo_replace);
  }

  setup_button() {
    const command = "swanLogo:toggle-check-spelling";
    this.app.commands.addCommand(command, {
      label: "Check Spelling",
      execute: () => {
        this.toggle_logoReplace();
      }
    });
    this.palette.addItem({ command, category: "Toggle Spell Checker" });
  }
}
/**
 * Activate extension
 */
function activate(
  app: JupyterLab,
  tracker: INotebookTracker,
  palette: ICommandPalette
) {
  console.log("Attempting to load swanLogo");
  const sp = new swanLogo(app, tracker, palette);
  console.log("swanLogo Loaded ", sp);
}

/**
 * Initialization data for the jupyterlab_swanLogo extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: "jupyterlab_swanLogo",
  autoStart: true,
  requires: [INotebookTracker, ICommandPalette],
  activate: activate
};

export default extension;
